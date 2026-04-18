import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_pence: number;
  currency: string;
  seat_based: boolean | null;
  features: string[];
  position: number;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  position: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  position: number;
};
