import { Hono } from "hono";
import { getDb } from "@/worker/lib/db";
import { rateLimitMiddleware } from "@/worker/middleware/rateLimit";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// Full request body schema for POST /api/leads
const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email format"),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  selectedServices: z.array(z.string()).optional(),
  selectedPackage: z.string().max(100).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  goals: z.string().max(5000).optional().nullable(),
  deadline: z.string().max(200).optional().nullable(),
  additionalInfo: z.string().max(5000).optional().nullable(),
  engagement: z
    .object({
      timeOnSite: z.number().optional(),
      pagesViewed: z.number().optional(),
      scrollDepth: z.number().optional(),
      quizCompleted: z.boolean().optional(),
      returnVisit: z.boolean().optional(),
      interactions: z.number().optional(),
    })
    .passthrough()
    .optional(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
});

type LeadInput = z.infer<typeof leadSchema>;

// Email retry function with exponential backoff
async function sendEmailWithRetry(
  url: string,
  data: any,
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return; // Success
      }
      
      // If last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw new Error(`Email failed after ${maxRetries} attempts`);
      }
    } catch (error) {
      // If last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = 1000 * Math.pow(2, attempt);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Apply rate limiting: 5 submissions per minute
app.post("/api/leads", rateLimitMiddleware(5, 60000), async (c) => {
  try {
    let parsed: LeadInput;
    try {
      const body = await c.req.json();
      parsed = leadSchema.parse({
        ...body,
        name: body.name ?? "",
        email: body.email ?? "",
        phone: body.phone ?? null,
        company: body.company ?? null,
        selectedServices: body.selectedServices ?? undefined,
        selectedPackage: body.selectedPackage ?? null,
        budget: body.budget ?? null,
        goals: body.goals ?? null,
        deadline: body.deadline ?? null,
        additionalInfo: body.additionalInfo ?? null,
        engagement: body.engagement ?? undefined,
        utm_source: body.utm_source ?? null,
        utm_medium: body.utm_medium ?? null,
        utm_campaign: body.utm_campaign ?? null,
        referrer: body.referrer ?? null,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const first = err.errors[0];
        const msg = first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
        return c.json({ error: msg }, 400);
      }
      return c.json({ error: "Invalid request body" }, 400);
    }

    const {
      name,
      company,
      phone,
      email,
      selectedServices,
      selectedPackage,
      budget,
      goals,
      deadline,
      additionalInfo,
      engagement: engagementInput,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
    } = parsed;

    const phoneValue = phone && String(phone).trim() ? String(phone) : null;
    const referrerValue = referrer || c.req.header("referer") || c.req.header("referrer") || null;

    const engagement = engagementInput ?? {};
    let score = 0;
    
    // Basic form data (max 60 points)
    if (selectedPackage) score += 30;
    if (selectedServices && selectedServices.length > 0) score += 20;
    if (budget) score += 20;
    if (goals && goals.length > 50) score += 15;
    if (deadline) score += 15;
    
    // Engagement metrics (max 40 points)
    // Time on site: 0-5min = 0, 5-10min = 5, 10-15min = 10, 15+ = 15
    const timeOnSite = engagement.timeOnSite || 0;
    if (timeOnSite >= 900) score += 15; // 15+ minutes
    else if (timeOnSite >= 600) score += 10; // 10-15 minutes
    else if (timeOnSite >= 300) score += 5; // 5-10 minutes
    
    // Pages viewed: 1-2 = 0, 3-4 = 5, 5+ = 10
    const pagesViewed = engagement.pagesViewed || 1;
    if (pagesViewed >= 5) score += 10;
    else if (pagesViewed >= 3) score += 5;
    
    // Scroll depth: 0-25% = 0, 25-50% = 3, 50-75% = 5, 75-100% = 8
    const scrollDepth = engagement.scrollDepth || 0;
    if (scrollDepth >= 75) score += 8;
    else if (scrollDepth >= 50) score += 5;
    else if (scrollDepth >= 25) score += 3;
    
    // Quiz completed: +5 points
    if (engagement.quizCompleted) score += 5;
    
    // Return visit: +5 points (shows interest)
    if (engagement.returnVisit) score += 5;
    
    // Interactions: 0-5 = 0, 6-10 = 2, 11+ = 5
    const interactions = engagement.interactions || 0;
    if (interactions >= 11) score += 5;
    else if (interactions >= 6) score += 2;
    
    // Cap score at 100
    score = Math.min(score, 100);

    const db = getDb(c.env);
    const result = await db.insertLead({
      name,
      company: company || null,
      phone: phoneValue,
      email,
      selected_services: selectedServices ? JSON.stringify(selectedServices) : null,
      selected_package: selectedPackage || null,
      budget: budget || null,
      goals: goals || null,
      deadline: deadline || null,
      additional_info: additionalInfo || null,
      score,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      referrer: referrerValue,
    });

    // Send thank-you email to client (with retry)
    sendEmailWithRetry(
      `${new URL(c.req.url).origin}/api/emails/brief-thank-you`,
      { email, name, language: 'az' }
    ).catch(error => {
      console.error('Failed to send thank-you email after retries:', error);
    });

    // Send admin notification (with retry)
    sendEmailWithRetry(
      `${new URL(c.req.url).origin}/api/emails/admin-notification`,
      { 
        name, email, phone: phoneValue, company, 
        selected_package: selectedPackage,
        selected_services: selectedServices ? JSON.stringify(selectedServices) : null,
        budget, goals, deadline, 
        additional_info: additionalInfo,
        score,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer: referrerValue
      }
    ).catch(error => {
      console.error('Failed to send admin notification after retries:', error);
    });

    return c.json({ 
      success: true, 
      message: "Lead created successfully",
      leadId: result.id,
      score
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
