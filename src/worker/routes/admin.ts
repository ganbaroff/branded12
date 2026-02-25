import { Hono } from "hono";
import { adminAuthMiddleware } from "@/worker/middleware/adminAuth";
import { getDb } from "@/worker/lib/db";

const adminAuth = adminAuthMiddleware();

const app = new Hono<{ Bindings: Env }>();

// Get all services
app.get("/api/admin/services", adminAuth, async (c) => {
  const results = await getDb(c.env).getServices();
  return c.json(results);
});

// Update service
app.put("/api/admin/services/:id", adminAuth, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await getDb(c.env).updateService(id, body);
  return c.json({ success: true });
});

// Get all pricing packages
app.get("/api/admin/packages", adminAuth, async (c) => {
  const results = await getDb(c.env).getPackages();
  return c.json(results);
});

// Update pricing package
app.put("/api/admin/packages/:id", adminAuth, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  await getDb(c.env).updatePackage(id, { ...body, is_popular: body.is_popular });
  return c.json({ success: true });
});

// Get all testimonials
app.get("/api/admin/testimonials", adminAuth, async (c) => {
  const results = await getDb(c.env).getTestimonials();
  return c.json(results);
});

// Update testimonial
app.put("/api/admin/testimonials/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  await getDb(c.env).updateTestimonial(id, body);
  return c.json({ success: true });
});

// Get all portfolio items
app.get("/api/admin/portfolio", adminAuth, async (c) => {
  const results = await getDb(c.env).getPortfolioItems();
  return c.json(results);
});

// Update portfolio item
app.put("/api/admin/portfolio/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  await getDb(c.env).updatePortfolioItem(id, body);
  return c.json({ success: true });
});

// Create portfolio item
app.post("/api/admin/portfolio", adminAuth, async (c) => {
  const body = await c.req.json();
  await getDb(c.env).createPortfolioItem(body);
  return c.json({ success: true });
});

// Delete portfolio item
app.delete("/api/admin/portfolio/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  await getDb(c.env).deletePortfolioItem(id);
  return c.json({ success: true });
});

// Get all cases
app.get("/api/admin/cases", adminAuth, async (c) => {
  const results = await getDb(c.env).getCases();
  return c.json(results);
});

// Create case
app.post("/api/admin/cases", adminAuth, async (c) => {
  const body = await c.req.json();
  await getDb(c.env).createCase(body);
  return c.json({ success: true });
});

// Update case
app.put("/api/admin/cases/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  await getDb(c.env).updateCase(id, body);
  return c.json({ success: true });
});

// Delete case
app.delete("/api/admin/cases/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  await getDb(c.env).deleteCase(id);
  return c.json({ success: true });
});

// Get all leads with pagination, filters, and search
app.get("/api/admin/leads", adminAuth, async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "20");
  const status = c.req.query("status");
  const search = c.req.query("search");
  const minScore = c.req.query("minScore")
    ? parseInt(c.req.query("minScore")!, 10)
    : undefined;
  const { leads, total } = await getDb(c.env).getLeads({
    page,
    limit,
    status: status ?? undefined,
    search: search ?? undefined,
    minScore,
  });
  return c.json({
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Delete lead
app.delete("/api/admin/leads/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  await getDb(c.env).deleteLead(id);
  return c.json({ success: true });
});

// Get all blog posts
app.get("/api/admin/blog", adminAuth, async (c) => {
  const results = await getDb(c.env).getAdminBlogPosts();
  return c.json(results);
});

// Create blog post
app.post("/api/admin/blog", adminAuth, async (c) => {
  const body = await c.req.json();
  await getDb(c.env).createBlogPost(body);
  return c.json({ success: true });
});

// Update blog post
app.put("/api/admin/blog/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  await getDb(c.env).updateBlogPost(id, body);
  return c.json({ success: true });
});

// Delete blog post
app.delete("/api/admin/blog/:id", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  await getDb(c.env).deleteBlogPost(id);
  return c.json({ success: true });
});

// Update lead status
app.put("/api/admin/leads/:id/status", adminAuth, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = await c.req.json();
  await getDb(c.env).updateLeadStatus(id, body.status);
  return c.json({ success: true });
});

// Bulk update lead statuses
app.post("/api/admin/leads/bulk-status", adminAuth, async (c) => {
  const body = await c.req.json();
  const { ids, status } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ error: "IDs array is required" }, 400);
  }
  const numIds = ids.map((x: string | number) => parseInt(String(x), 10));
  await getDb(c.env).bulkUpdateLeadStatus(numIds, status);
  return c.json({ success: true, updated: numIds.length });
});

export default app;
