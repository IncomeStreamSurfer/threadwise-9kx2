const RESEND_API = 'https://api.resend.com/emails';

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const apiKey = import.meta.env.RESEND_API_KEY as string;
  if (!apiKey) return { skipped: true };
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from ?? 'Threadwise <onboarding@resend.dev>',
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error('Resend error', res.status, body);
    return { ok: false, status: res.status, body };
  }
  return { ok: true };
}

export function orderConfirmationHtml(opts: {
  productName: string;
  seats: number;
  amountPence: number;
  currency: string;
}) {
  const amount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: opts.currency.toUpperCase(),
  }).format(opts.amountPence / 100);
  return `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#0f172a;">
    <h1 style="font-size:22px;margin:0 0 16px;">You're on Threadwise 🎉</h1>
    <p>Thanks for subscribing to the <strong>${opts.productName}</strong> plan.</p>
    <ul style="line-height:1.8">
      <li>Seats: ${opts.seats}</li>
      <li>Amount: ${amount}/month per seat</li>
    </ul>
    <p>We'll email setup instructions shortly. Reply to this email with any questions.</p>
    <p style="color:#64748b;font-size:12px;margin-top:32px;">Threadwise · team knowledge, threaded.</p>
  </div>`;
}

export function leadConfirmationHtml(opts: { name?: string }) {
  return `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#0f172a;">
    <h1 style="font-size:22px;margin:0 0 16px;">Welcome to Threadwise${opts.name ? ', ' + opts.name : ''} 👋</h1>
    <p>Thanks for signing up for early access. We'll be in touch shortly with your invite.</p>
    <p>In the meantime, reply to this email and tell us about your team — what tools are you trying to replace?</p>
    <p style="color:#64748b;font-size:12px;margin-top:32px;">Threadwise · team knowledge, threaded.</p>
  </div>`;
}
