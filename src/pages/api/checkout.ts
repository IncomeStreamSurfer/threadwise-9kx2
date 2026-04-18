import type { APIRoute } from 'astro';
import { createCheckoutSession, getProductBySlug } from '../../lib/stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const form = await request.formData();
    const slug = String(form.get('product_slug') || '');
    const qty = Math.max(1, Math.min(500, parseInt(String(form.get('quantity') || '1'), 10) || 1));

    if (!slug) return new Response('Missing product', { status: 400 });

    const product = await getProductBySlug(slug);
    if (!product) return new Response('Product not found', { status: 404 });

    const origin = import.meta.env.PUBLIC_SITE_URL || url.origin;

    const session = await createCheckoutSession({
      product,
      quantity: qty,
      successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pricing`,
    });

    return new Response(null, {
      status: 303,
      headers: { Location: session.url! },
    });
  } catch (err: any) {
    console.error('checkout error', err);
    return new Response(JSON.stringify({ error: err?.message || 'Checkout failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
