import Stripe from 'stripe';
import { supabase, type Product } from './supabase';

export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-09-30.clover',
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function createCheckoutSession(opts: {
  product: Product;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const { product, quantity, successUrl, cancelUrl, customerEmail } = opts;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: product.currency || 'gbp',
          product_data: {
            name: `Threadwise ${product.name}`,
            description: product.description ?? undefined,
          },
          unit_amount: product.price_pence,
          recurring: { interval: 'month' },
        },
        quantity,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      product_slug: product.slug,
      product_name: product.name,
      seats: String(quantity),
    },
    subscription_data: {
      metadata: {
        product_slug: product.slug,
      },
    },
  });
  return session;
}
