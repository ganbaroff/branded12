/**
 * Types shared between the client and server go here.
 *
 * For example, we can add zod schemas for API input validation, and derive types from them:
 *
 * export const TodoSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   completed: z.number().int(), // 0 or 1
 * })
 *
 * export type TodoType = z.infer<typeof TodoSchema>;
 */

export interface Env {
  /** D1 database (optional when using Supabase via SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) */
  DB?: D1Database;
  R2_BUCKET: R2Bucket;
  /** Admin panel password (local auth). Set via wrangler secret / .dev.vars */
  ADMIN_PASSWORD?: string;
  /** Optional secret for signing session cookie; if unset, ADMIN_PASSWORD is used */
  ADMIN_SESSION_SECRET?: string;
  /** Supabase: project URL (e.g. https://xxx.supabase.co). When set, DB layer uses Supabase instead of D1. */
  SUPABASE_URL?: string;
  /** Supabase: service_role key (server-side only). Required when SUPABASE_URL is set. */
  SUPABASE_SERVICE_ROLE_KEY?: string;
}
