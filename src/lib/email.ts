// Transactional email via Resend, gated on RESEND_API_KEY. Without the key the
// app still runs: sends are skipped (and in dev the link is logged so the flow
// stays testable). Wired for email verification and password reset.
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function baseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function appUrl(path: string): string {
  return `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "SOMA <onboarding@resend.dev>";
  if (!key) {
    console.log(`[email:dev] (no RESEND_API_KEY) would send to ${to}: ${subject}`);
    return false;
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("Resend send failed:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error("Resend error:", e);
    return false;
  }
}

function shell(heading: string, intro: string, ctaUrl: string, ctaLabel: string): string {
  return `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;color:#283128">
    <div style="font-size:28px;letter-spacing:2px;font-weight:600">SŌMA</div>
    <h1 style="font-size:20px;margin:24px 0 8px">${heading}</h1>
    <p style="font-size:15px;line-height:1.5;color:#4b524b">${intro}</p>
    <p style="margin:28px 0">
      <a href="${ctaUrl}" style="background:#283128;color:#f4f0e6;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:15px">${ctaLabel}</a>
    </p>
    <p style="font-size:12px;color:#8a908a">If you didn't request this, you can ignore this email.</p>
  </div>`;
}

export async function sendVerificationEmail(to: string, rawToken: string): Promise<boolean> {
  const url = appUrl(`/verify?token=${encodeURIComponent(rawToken)}`);
  if (process.env.NODE_ENV !== "production") console.log(`[verify-link] ${url}`);
  return sendEmail(
    to,
    "Confirm your SŌMA email",
    shell("Confirm your email", "Tap below to verify your email and finish creating your SŌMA account. The link expires in 24 hours.", url, "Verify email"),
  );
}

export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<boolean> {
  const url = appUrl(`/reset?token=${encodeURIComponent(rawToken)}`);
  if (process.env.NODE_ENV !== "production") console.log(`[reset-link] ${url}`);
  return sendEmail(
    to,
    "Reset your SŌMA password",
    shell("Reset your password", "Tap below to choose a new password. The link expires in 1 hour. If you didn't ask for this, nothing has changed.", url, "Reset password"),
  );
}
