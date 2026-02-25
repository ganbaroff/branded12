# Supabase setup for B2Brand

You can run the app database on **Supabase** (PostgreSQL) instead of Cloudflare D1. The worker uses **Supabase** when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set; otherwise it uses D1.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API** note:
   - **Project URL** → use as `SUPABASE_URL`
   - **service_role** (secret) → use as `SUPABASE_SERVICE_ROLE_KEY` (never expose on the client).

## 2. Run the schema

1. In Supabase Dashboard open **SQL Editor**.
2. Run the contents of **`supabase/schema.sql`** (creates tables and indexes).
3. Optionally run seed data: copy from `migrations/1.sql` (INSERTs for services, pricing_packages, testimonials, portfolio_items) and adapt for PostgreSQL (e.g. `BOOLEAN` use `true`/`false` instead of `0`/`1`).

## 3. Configure the Worker

Set the following **secrets** (e.g. via Wrangler or Cloudflare Dashboard):

```bash
wrangler secret put SUPABASE_URL     # e.g. https://xxxx.supabase.co
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Or in **Cloudflare Dashboard** → your Worker → **Settings → Variables and Secrets** add:

- `SUPABASE_URL` = your project URL  
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key  

For **local dev** with Supabase, create `.dev.vars` in the project root (do not commit):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Optional: keep D1 for some environments

- If you **do not** set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, the app keeps using **D1** (existing behaviour).
- You can use D1 in one environment and Supabase in another by only setting the Supabase secrets where needed.

## 5. RLS (Row Level Security)

Tables have RLS enabled. The Worker uses the **service_role** key, which bypasses RLS. Do not use the anon key for the Worker.

## 6. Optional: Chat with Gemini

To enable the `/api/chat` endpoint (AI replies), set `GEMINI_API_KEY` in secrets or `.dev.vars`. Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey). Never commit the key or expose it on the client.

## Summary

| Step | Action |
|------|--------|
| 1 | Create Supabase project, copy Project URL and service_role key |
| 2 | Run `supabase/schema.sql` in SQL Editor |
| 3 | Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (secrets or `.dev.vars`) |
| 4 | Deploy or run `npm run dev`; the app will use Supabase for all DB operations |
