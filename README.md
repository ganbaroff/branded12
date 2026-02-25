## My new app

To run the dev server:
```
npm install
npm run dev
```

### Admin panel

The admin panel uses **password-based login** (no Google OAuth). Set `ADMIN_PASSWORD` in your environment. For local development with Wrangler/Vite, put it in `.dev.vars` (see `.env.example`). Only users who know this password can access `/admin`.
