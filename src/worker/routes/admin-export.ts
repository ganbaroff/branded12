import { Hono } from "hono";
import type { Env } from "@/shared/types";
import { adminAuthMiddleware } from "@/worker/middleware/adminAuth";
import { getDb } from "@/worker/lib/db";

const app = new Hono<{ Bindings: Env }>();

// GET /api/admin/export/leads - Export leads as CSV
app.get("/export/leads", adminAuthMiddleware(), async (c) => {
  try {
    const leads = await getDb(c.env).getAllLeads();
    if (!leads.length) {
      return c.text("No leads found", 404);
    }
    const headers = [
      "ID",
      "Name",
      "Company",
      "Email",
      "Phone",
      "Selected Package",
      "Budget",
      "Goals",
      "Score",
      "Created At"
    ];
    const rows = leads.map((lead: unknown) => {
      const l = lead as Record<string, unknown>;
      return [
        l.id,
        l.name,
        l.company ?? "",
        l.email,
        l.phone ?? "",
        l.selected_package ?? "",
        l.budget ?? "",
        l.goals ?? "",
        l.score,
        l.created_at
      ];
    });

    let csv = headers.join(",") + "\n";
    rows.forEach((row: unknown[]) => {
      csv += (row as (string | number)[]).map((field: string | number) => {
        // Escape quotes and wrap in quotes if contains comma or quote
        const str = String(field).replace(/"/g, '""');
        return str.includes(',') || str.includes('"') ? `"${str}"` : str;
      }).join(",") + "\n";
    });
    
    return c.text(csv, 200, {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`
    });
  } catch (error) {
    console.error("Error exporting leads:", error);
    return c.json({ error: "Failed to export leads" }, 500);
  }
});

export default app;
