# Smoke checklist

Short list to run after deploy or before release. Verify each item in the browser.

## Public pages

- **Home:** Hero, services section, portfolio section, testimonials visible. Buttons "Bütün işlərə bax" and "Bütün xidmətlər" go to `/portfolio` and `/services`. Language switch AZ/RU/EN works.
- **Services:** Service cards with "Ətraflı" lead to `/pricing` or `/brief`.
- **Portfolio:** List loads (or fallback when API is empty). Each card "Ətraflı" goes to `/portfolio/:id`. Filters work.
- **Portfolio detail:** Opening a project shows title, image, description; "Back to portfolio" goes to `/portfolio`.
- **Cases:** Content visible (or demo fallback when API is empty).
- **Blog:** Post list visible (or fallback). Clicking a post goes to `/blog/:slug`.
- **Brief:** Submit form; on success only one toast "Təşəkkürlər!" (no lingering "Gönderilir..."). On error, toast shows error.

## Admin

- **Login:** `/admin` shows password form (no Google). After correct password, dashboard loads.
- **Tabs:** Dashboard, services, packages, testimonials, portfolio, cases, leads, blog — all load. Leads: filters and pagination work. Export leads (CSV) works.
- **Logout:** Button clears session and shows login again.

## Console

- No "Invalid PixelID: null" when `VITE_FB_PIXEL_ID` is not set.

## Automated checks (before commit/deploy)

- `npm run lint`
- `npm run build`
- `npm run test`
