import { Hono } from 'hono';
import { getDb } from "@/worker/lib/db";

const portfolio = new Hono<{ Bindings: Env }>();

// Get all portfolio items
portfolio.get('/api/portfolio', async (c) => {
  const results = await getDb(c.env).getPortfolioItems();
  return c.json(results);
});

// Get single portfolio item
portfolio.get('/api/portfolio/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (Number.isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
  const result = await getDb(c.env).getPortfolioItem(id);
  if (!result) return c.json({ error: 'Portfolio item not found' }, 404);
  return c.json(result);
});

// Get all cases
portfolio.get('/api/cases', async (c) => {
  const results = await getDb(c.env).getCases();
  return c.json(results);
});

// Get single case by slug
portfolio.get('/api/cases/:slug', async (c) => {
  const slug = c.req.param('slug');
  const result = await getDb(c.env).getCaseBySlug(slug);
  if (!result) return c.json({ error: 'Case not found' }, 404);
  return c.json(result);
});

export default portfolio;
