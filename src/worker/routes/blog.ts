import { Hono } from "hono";
import { getDb } from "@/worker/lib/db";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/blog", async (c) => {
  try {
    const results = await getDb(c.env).getBlogPosts();
    return c.json(results);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return c.json({ error: "Failed to fetch blog posts" }, 500);
  }
});

app.get("/api/blog/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const result = await getDb(c.env).getBlogPostBySlug(slug);
    if (!result) {
      return c.json({ error: "Blog post not found" }, 404);
    }
    return c.json(result);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return c.json({ error: "Failed to fetch blog post" }, 500);
  }
});

export default app;
