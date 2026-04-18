import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail, leadConfirmationHtml } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, name, company, team_size } = body ?? {};
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
    }

    const { error } = await supabase.from('leads').insert({
      email,
      name: name || null,
      company: company || null,
      team_size: team_size || null,
      source: 'home_signup',
    });
    if (error) {
      console.error('lead insert', error);
      return new Response(JSON.stringify({ error: 'Could not save — try again' }), { status: 500 });
    }

    // fire-and-forget confirmation email
    sendEmail({
      to: email,
      subject: 'Welcome to Threadwise 👋',
      html: leadConfirmationHtml({ name }),
    }).catch((e) => console.error('email error', e));

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }
};
