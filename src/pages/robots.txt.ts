import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const base = import.meta.env.PUBLIC_SITE_URL || url.origin;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
