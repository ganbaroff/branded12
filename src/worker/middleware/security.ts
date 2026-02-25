import { Context } from 'hono';

export const securityHeaders = async (c: Context, next: () => Promise<void>) => {
  await next();
  
  // Set security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://mc.yandex.ru; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: http:; " +
    "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://mc.yandex.ru; " +
    "frame-src 'self' https://www.facebook.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
  c.header(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
};
