import { Hono } from "hono";
import { z } from "zod";
import { rateLimitMiddleware } from "@/worker/middleware/rateLimit";

const app = new Hono<{ Bindings: Env }>();

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(4000),
});

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_TIMEOUT_MS = 25000;

app.post("/api/chat", rateLimitMiddleware(15, 60000), async (c) => {
  const apiKey = c.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== "string") {
    return c.json({ error: "Chat not configured" }, 503);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid request body" }, 400);
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    const msg = first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
    return c.json({ error: msg }, 400);
  }

  const { message } = parsed.data;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText.slice(0, 200));
      return c.json({ error: "Service temporarily unavailable" }, 502);
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    return c.json({ reply: text || "I couldn't generate a response." });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return c.json({ error: "Request timed out" }, 504);
    }
    console.error("Chat error:", err);
    return c.json({ error: "Service temporarily unavailable" }, 502);
  }
});

export default app;
