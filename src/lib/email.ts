import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required to send email.");
  }

  return new Resend(apiKey);
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lawful-human-smash.vercel.app";

/** Escapes text dropped into the HTML email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function emailShell(bodyHtml: string) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#D9D7CB; font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#D9D7CB; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#f9f4d8; border:1px solid #E2CE9C; border-radius:4px; overflow:hidden;">
            <tr>
              <td style="background-color:#263A1E; padding:24px 32px; text-align:center;">
                <span style="font-size:28px;">🌿</span>
                <h1 style="margin:8px 0 0; color:#f9f4d8; font-size:20px; letter-spacing:0.05em; font-weight:normal;">
                  Adam &amp; Mady
                </h1>
                <p style="margin:4px 0 0; color:#C29A48; font-size:13px; letter-spacing:0.08em; text-transform:uppercase;">
                  July 10th, 2027
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 28px; text-align:center; border-top:1px solid #E2CE9C;">
                <p style="margin:16px 0 0; color:#56604A; font-size:13px;">
                  With love,<br />Adam &amp; Mady
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function questionAnsweredHtml(question: string, answer: string) {
  const q = escapeHtml(question);
  const a = escapeHtml(answer).replace(/\n/g, "<br />");

  return emailShell(`
    <p style="margin:0 0 24px; color:#3E5E34; font-size:18px; text-align:center;">
      Your question has been answered! 💌
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      You asked
    </p>
    <p style="margin:0 0 20px; color:#283121; font-size:16px; font-style:italic;">
      “${q}”
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      Our answer
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E2E0D4; border-left:3px solid #C4552B; border-radius:2px;">
      <tr>
        <td style="padding:16px 18px; color:#283121; font-size:15px; line-height:1.6;">
          ${a}
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0; text-align:center;">
      <a href="${SITE_URL}/qa" style="display:inline-block; background-color:#3E5E34; color:#f9f4d8; text-decoration:none; padding:12px 28px; border-radius:4px; font-size:14px; letter-spacing:0.05em;">
        See it on the site
      </a>
    </p>
  `);
}

interface RsvpGuestSummary {
  name: string;
  attending: boolean;
}

function rsvpThankYouHtml(guests: RsvpGuestSummary[], code: string) {
  const anyAttending = guests.some((g) => g.attending);
  const rsvpLink = `${SITE_URL}/rsvp?code=${code}`;

  const rows = guests
    .map(
      (g) => `
      <tr>
        <td style="padding:8px 0; color:#283121; font-size:15px; border-bottom:1px solid #E2E0D4;">
          ${escapeHtml(g.name)}
        </td>
        <td style="padding:8px 0; text-align:right; font-size:13px; border-bottom:1px solid #E2E0D4; color:${
          g.attending ? "#3E5E34" : "#9C3D1C"
        };">
          ${g.attending ? "Joyfully accepted ✨" : "Regretfully declined"}
        </td>
      </tr>`
    )
    .join("");

  return emailShell(`
    <p style="margin:0 0 12px; color:#3E5E34; font-size:18px; text-align:center;">
      ${anyAttending ? "Thanks for your RSVP! 🎉" : "Thanks for letting us know 💛"}
    </p>
    <p style="margin:0 0 24px; color:#56604A; font-size:14px; text-align:center;">
      ${
        anyAttending
          ? "We can't wait to celebrate with you on July 10th, 2027."
          : "You'll be missed, but we appreciate you letting us know."
      }
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
    </table>

    <p style="margin:28px 0 0; text-align:center;">
      <a href="${rsvpLink}" style="display:inline-block; background-color:#3E5E34; color:#f9f4d8; text-decoration:none; padding:12px 28px; border-radius:4px; font-size:14px; letter-spacing:0.05em;">
        View or update your RSVP
      </a>
    </p>
  `);
}

/** Notifies a guest by email that their Q&A question has been answered. */
export async function sendQuestionAnsweredEmail(
  to: string,
  question: string,
  answer: string
) {
  await getResendClient().emails.send({
    from: "Adam & Mady <wedding@adamprobert.com>",
    to,
    replyTo: "wedding@adamprobert.com",
    subject: "Your question has been answered",
    text: `You asked:\n${question}\n\nOur answer:\n${answer}\n\nSee it on the site: ${SITE_URL}/qa`,
    html: questionAnsweredHtml(question, answer),
  });
}

/** Thanks a party for submitting their RSVP, summarising each guest's response. */
export async function sendRsvpThankYouEmail(
  to: string,
  guests: RsvpGuestSummary[],
  code: string
) {
  const anyAttending = guests.some((g) => g.attending);
  const summary = guests
    .map((g) => `${g.name}: ${g.attending ? "Attending" : "Not attending"}`)
    .join("\n");
  const rsvpLink = `${SITE_URL}/rsvp?code=${code}`;

  await getResendClient().emails.send({
    from: "Adam & Mady <wedding@adamprobert.com>",
    to,
    replyTo: "wedding@adamprobert.com",
    subject: anyAttending ? "Thanks for your RSVP!" : "Thanks for letting us know",
    text: `${summary}\n\nView or update your RSVP: ${rsvpLink}`,
    html: rsvpThankYouHtml(guests, code),
  });
}
