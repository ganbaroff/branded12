import { Hono } from "hono";
import type { Env } from "@/shared/types";
import { adminAuthMiddleware } from "@/worker/middleware/adminAuth";
import { getDb } from "@/worker/lib/db";

const app = new Hono<{ Bindings: Env }>();

// GET /api/admin/stats - Get dashboard statistics
app.get("/stats", adminAuthMiddleware(), async (c) => {
  try {
    const stats = await getDb(c.env).getLeadStats();
    return c.json({
      totalLeads: stats.totalLeads,
      todayLeads: stats.todayLeads,
      avgScore: stats.avgScore,
      conversionRate: stats.conversionRate,
      packageDistribution: stats.packageDistribution,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch statistics" }, 500);
  }
});

export default app;
