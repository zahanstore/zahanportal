import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL     = 'Zahan Store® <noreply@mail.zahan.one>';

// Department routing
const DEPT_MAP: Record<string, { label: string; email: string; color: string }> = {
  support: { label: 'Support & Orders',  email: 'support@mail.zahan.one', color: '#60c0ff' },
  store:   { label: 'Brand & Feedback',  email: 'store@mail.zahan.one',   color: '#a78bfa' },
  legal:   { label: 'Legal & Policy',    email: 'legal@mail.zahan.one',   color: '#e879f9' },
  hr:      { label: 'HR & Careers',      email: 'hr@mail.zahan.one',      color: '#34d399' },
};

serve(async (req) => {
  try {
    const payload = await req.json();
    const record  = payload.record ?? payload;
    const { name, email, department, subject, message, created_at } = record;

    const dept     = DEPT_MAP[department] ?? { label: department, email: 'store@mail.zahan.one', color: '#5b8dee' };
    const sentTime = new Date(created_at).toLocaleString('en-GB', { timeZone: 'Asia/Dubai' });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0b0d17;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0d17;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#131726;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        
        <tr>
          <td style="background:linear-gradient(135deg,#5b8dee 0%,#a78bfa 100%);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">✉️ New Message — Zahan Store®</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
              Routed to <strong>${dept.label}</strong> · ${sentTime} GST
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 40px 0;">
            <span style="background:${dept.color}22;color:${dept.color};border:1px solid ${dept.color}44;border-radius:20px;padding:6px 16px;font-size:13px;font-weight:600;">
              ${dept.label}
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1f33;border-radius:12px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;color:#7c859e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">From</p>
                  <p style="margin:0;color:#eef0f8;font-size:16px;font-weight:600;">${name}</p>
                  <p style="margin:4px 0 0;color:#5b8dee;font-size:14px;">${email}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 40px 0;">
            <p style="margin:0 0 6px;color:#7c859e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Subject</p>
            <p style="margin:0;color:#eef0f8;font-size:18px;font-weight:600;">${subject}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 40px 32px;">
            <p style="margin:0 0 10px;color:#7c859e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</p>
            <div style="background:#1a1f33;border-left:3px solid ${dept.color};border-radius:0 12px 12px 0;padding:20px 24px;">
              <p style="margin:0;color:#eef0f8;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 32px;">
            <a href="mailto:${email}?subject=Re: ${subject}"
               style="display:inline-block;background:linear-gradient(135deg,#5b8dee,#a78bfa);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;">
              Reply to ${name} →
            </a>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #1a1f33;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#7c859e;font-size:12px;">Zahan Store® · zahan.one · Made with ♥ in Abu Dhabi, UAE 🌙</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     FROM_EMAIL,
        to:       [dept.email],
        subject:  `[${dept.label}] ${subject} — from ${name}`,
        html,
        reply_to: email,
      }),
    });

    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: data }), { status: 500 });

    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
