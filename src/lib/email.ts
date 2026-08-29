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

/** Notification inbox for Adam & Mady, where guest activity lands. */
const NOTIFY_EMAIL = "15barberryrise@gmail.com";

/** Wedding date, in the one casing and format the emails use. */
const WEDDING_DATE = "July 10th 2027";

/** Escapes text dropped into the HTML email body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function emailShell(bodyHtml: string, signOff = "With love,<br />Adam &amp; Mady") {
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
                <h1 style="margin:8px 0 0; color:#f9f4d8; font-size:20px; letter-spacing:0.05em; font-weight:normal;">
                  Adam &amp; Mady
                </h1>
                <p style="margin:4px 0 0; color:#C29A48; font-size:13px; letter-spacing:0.08em;">
                  ${WEDDING_DATE}
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
                  ${signOff}
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
      Your question has been answered
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
          ${g.attending ? "Joyfully accepted" : "Regretfully declined"}
        </td>
      </tr>`
    )
    .join("");

  return emailShell(`
    <p style="margin:0 0 12px; color:#3E5E34; font-size:18px; text-align:center;">
      ${anyAttending ? "Thanks for your RSVP!" : "Thanks for letting us know"}
    </p>
    <p style="margin:0 0 24px; color:#56604A; font-size:14px; text-align:center;">
      ${
        anyAttending
          ? `We can't wait to celebrate with you on ${WEDDING_DATE}.`
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

interface QuestionAskedDetails {
  name: string;
  email?: string | null;
  question: string;
}

function questionAskedHtml({ name, email, question }: QuestionAskedDetails) {
  const asker = email
    ? `${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;`
    : escapeHtml(name);
  const q = escapeHtml(question).replace(/\n/g, "<br />");

  return emailShell(
    `
    <p style="margin:0 0 24px; color:#3E5E34; font-size:18px; text-align:center;">
      Someone has asked a question
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      From
    </p>
    <p style="margin:0 0 20px; color:#283121; font-size:16px;">
      ${asker}
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      They asked
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E2E0D4; border-left:3px solid #C4552B; border-radius:2px;">
      <tr>
        <td style="padding:16px 18px; color:#283121; font-size:15px; line-height:1.6;">
          ${q}
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0; text-align:center;">
      <a href="${SITE_URL}/secretgarden" style="display:inline-block; background-color:#3E5E34; color:#f9f4d8; text-decoration:none; padding:12px 28px; border-radius:4px; font-size:14px; letter-spacing:0.05em;">
        Answer it in the Secret Garden
      </a>
    </p>
  `,
    "Sent automatically by the wedding site."
  );
}

/**
 * Tells Adam &amp; Mady that a guest has asked a new question, linking straight
 * to the Secret Garden admin page so it can be answered.
 */
export async function sendQuestionAskedNotificationEmail(
  details: QuestionAskedDetails
) {
  const { name, email, question } = details;

  await getResendClient().emails.send({
    from: "Adam & Mady <wedding@adamprobert.com>",
    to: NOTIFY_EMAIL,
    replyTo: email || "wedding@adamprobert.com",
    subject: `New question from ${name}`,
    text: `${name}${email ? ` <${email}>` : ""} asked:\n${question}\n\nAnswer it: ${SITE_URL}/secretgarden`,
    html: questionAskedHtml(details),
  });
}

interface RsvpNotificationGuest extends RsvpGuestSummary {
  dietaryRequirements?: string | null;
  /** Display labels for the drinks this guest voted for, already emoji-prefixed. */
  drinks?: string[];
}

interface RsvpNotificationDetails {
  code: string;
  email: string;
  guests: RsvpNotificationGuest[];
  /** When this party last replied, or null if this is their first RSVP. */
  previouslySubmittedAt?: Date | null;
}

/** Formats a past submission date for the "previously replied" line. */
function formatSubmittedAt(date: Date) {
  return date.toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/London",
  });
}

function rsvpNotificationHtml({
  code,
  email,
  guests,
  previouslySubmittedAt,
}: RsvpNotificationDetails) {
  const attendingCount = guests.filter((g) => g.attending).length;
  const decliningCount = guests.length - attendingCount;
  const isAmendment = Boolean(previouslySubmittedAt);

  const rows = guests
    .map(
      (g) => `
      <tr>
        <td style="padding:8px 0; color:#283121; font-size:15px; border-bottom:1px solid #E2E0D4;">
          ${escapeHtml(g.name)}
          ${
            g.dietaryRequirements
              ? `<br /><span style="color:#9C7833; font-size:11px; letter-spacing:0.08em; text-transform:uppercase;">Dietary</span>
                 <span style="color:#56604A; font-size:12px; font-style:italic;">${escapeHtml(
                   g.dietaryRequirements
                 )}</span>`
              : ""
          }
          ${
            g.drinks && g.drinks.length
              ? `<br /><span style="color:#9C7833; font-size:11px; letter-spacing:0.08em; text-transform:uppercase;">Drinks</span>
                 <span style="color:#56604A; font-size:12px;">${g.drinks
                   .map(escapeHtml)
                   .join(", ")}</span>`
              : ""
          }
        </td>
        <td style="padding:8px 0; text-align:right; vertical-align:top; font-size:13px; border-bottom:1px solid #E2E0D4; color:${
          g.attending ? "#3E5E34" : "#9C3D1C"
        };">
          ${g.attending ? "Attending" : "Not attending"}
        </td>
      </tr>`
    )
    .join("");

  return emailShell(
    `
    <p style="margin:0 0 16px; text-align:center;">
      <span style="display:inline-block; padding:5px 14px; border-radius:999px; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; background-color:${
        isAmendment ? "#C4552B" : "#3E5E34"
      }; color:#f9f4d8;">
        ${isAmendment ? "Amended RSVP" : "New RSVP"}
      </span>
    </p>

    <p style="margin:0 0 12px; color:#3E5E34; font-size:18px; text-align:center;">
      ${
        isAmendment
          ? "A party has changed their RSVP"
          : "A new RSVP has come in"
      }
    </p>
    <p style="margin:0 0 8px; color:#56604A; font-size:14px; text-align:center;">
      ${attendingCount} attending${
        decliningCount ? `, ${decliningCount} not attending` : ""
      }
    </p>
    <p style="margin:0 0 24px; color:#56604A; font-size:13px; text-align:center; font-style:italic;">
      ${
        previouslySubmittedAt
          ? `These answers replace the ones they sent on ${escapeHtml(
              formatSubmittedAt(previouslySubmittedAt)
            )}.`
          : "This is their first reply."
      }
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      Party code
    </p>
    <p style="margin:0 0 20px; color:#283121; font-size:16px;">
      ${escapeHtml(code)}
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      Contact email
    </p>
    <p style="margin:0 0 20px; color:#283121; font-size:16px;">
      ${escapeHtml(email)}
    </p>

    <p style="margin:0 0 6px; color:#9C7833; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;">
      Their responses
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows}
    </table>

    <p style="margin:28px 0 0; text-align:center;">
      <a href="${SITE_URL}/secretgarden" style="display:inline-block; background-color:#3E5E34; color:#f9f4d8; text-decoration:none; padding:12px 28px; border-radius:4px; font-size:14px; letter-spacing:0.05em;">
        See it in the Secret Garden
      </a>
    </p>
  `,
    "Sent automatically by the wedding site."
  );
}

/** Tells Adam &amp; Mady that a party has submitted their RSVP. */
export async function sendRsvpNotificationEmail(
  details: RsvpNotificationDetails
) {
  const { code, email, guests, previouslySubmittedAt } = details;
  const attendingCount = guests.filter((g) => g.attending).length;
  const isAmendment = Boolean(previouslySubmittedAt);
  const summary = guests
    .map((g) => {
      const lines = [`${g.name}: ${g.attending ? "Attending" : "Not attending"}`];
      if (g.dietaryRequirements) {
        lines.push(`  Dietary: ${g.dietaryRequirements}`);
      }
      if (g.drinks && g.drinks.length) {
        lines.push(`  Drinks: ${g.drinks.join(", ")}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  await getResendClient().emails.send({
    from: "Adam & Mady <wedding@adamprobert.com>",
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `${isAmendment ? "Amended" : "New"} RSVP from ${
      guests[0]?.name || code
    } (${attendingCount}/${guests.length} attending)`,
    text: `${
      previouslySubmittedAt
        ? `AMENDED RSVP - replaces their answers from ${formatSubmittedAt(
            previouslySubmittedAt
          )}`
        : "NEW RSVP - their first reply"
    }\n\nParty code: ${code}\nContact email: ${email}\n\n${summary}\n\nSee it: ${SITE_URL}/secretgarden`,
    html: rsvpNotificationHtml(details),
  });
}
