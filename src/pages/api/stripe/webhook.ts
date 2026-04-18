import type { APIRoute } from 'astro';
import { stripe } from '../../../lib/stripe';
import { supabase } from '../../../lib/supabase';
import { sendEmail, orderConfirmationHtml } from '../../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET as string | undefined;
  const raw = await request.text();

  let event;
  try {
    if (!sig || !secret) throw new Error('Missing signature or webhook secret');
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    console.error('webhook verify failed', err?.message);
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const productSlug = session.metadata?.product_slug;
    const seats = parseInt(session.metadata?.seats || '1', 10);
    const email = session.customer_details?.email || session.customer_email;

    await supabase.from('orders').insert({
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
      product_slug: productSlug,
      amount_pence: session.amount_total,
      currency: session.currency,
      customer_email: email,
      status: 'paid',
    });

    if (email) {
      const name = session.metadata?.product_name || 'Threadwise';
      await sendEmail({
        to: email,
        subject: 'Your Threadwise subscription is active',
        html: orderConfirmationHtml({
          productName: name,
          seats,
          amountPence: session.amount_total || 0,
          currency: session.currency || 'gbp',
        }),
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
