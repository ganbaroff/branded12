import { Hono } from "hono";
import { securityHeaders } from "@/worker/middleware/security";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import portfolioRoutes from "./routes/portfolio";
import publicRoutes from "./routes/public";
import leadsRoutes from "./routes/leads";
import blogRoutes from "./routes/blog";
import chatRoutes from "./routes/chat";
import adminStatsRoutes from "./routes/admin-stats";
import adminExportRoutes from "./routes/admin-export";

const app = new Hono<{ Bindings: Env }>();

// Apply security headers globally
app.use("*", securityHeaders);

app.route("/", authRoutes);
app.route("/", adminRoutes);
app.route("/", portfolioRoutes);
app.route("/", publicRoutes);
app.route("/", leadsRoutes);
app.route("/", blogRoutes);
app.route("/", chatRoutes);
app.route("/api/admin", adminStatsRoutes);
app.route("/api/admin", adminExportRoutes);

export default app;
