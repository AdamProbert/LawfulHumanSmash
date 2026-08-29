RSVP email:
- For the date, go with format; July 10th 2027 (notice the casing)
> **DONE.** The date now lives in a single `WEDDING_DATE` constant in
> [email.ts](src/lib/email.ts) set to exactly `July 10th 2027` — no comma, capital J,
> lowercase ordinal. Both places that print it use the constant: the shell header and
> the "We can't wait to celebrate with you on ..." line, so they can't drift apart.
> **On the casing:** the header's date line had `text-transform:uppercase`, which was
> rendering it as `JULY 10TH 2027`. I removed that so it reads `July 10th 2027` as
> written. The small uppercase labels elsewhere ("You asked", "Our answer") are
> untouched — they're section labels, not the date.

Questions answered email:
- For the date, go with format; July 10th 2027 (notice the casing)
> **DONE.** Same `WEDDING_DATE` constant — this email uses the shared shell header, so
> it picks up the change automatically.

- Remove emoji at end of the question answered line
> **DONE.** `Your question has been answered! 💌` is now `Your question has been
> answered`. The `!` went with it, to match the emoji-free wording the UI branch
> settled on so the two branches merge cleanly.
> **Note:** the 🌿 in the email header and the ✨/🎉/💛 in the RSVP email are still here
> on this branch. They're being removed by the UI-tweaks branch under its blanket
> "no emojis" rule, so I left them alone rather than fight over the same lines.

Question asked notification email.
- I want a new email sent to 15barberryrise@gmail.com when a new question is asked.
- This is  anotification for Adam and Mady to let them know someone has asked.. it should link to the admin (secret garden) page so we can answer the email.
> **DONE.** New `sendQuestionAskedNotificationEmail` in [email.ts](src/lib/email.ts),
> fired from the guest-facing `POST` in
> [api/questions/route.ts](src/app/api/questions/route.ts).
> - **To:** `15barberryrise@gmail.com` (the `NOTIFY_EMAIL` constant, next to `SITE_URL`).
> - **Subject:** `New question from <name>`.
> - **Body:** who asked (name, plus their email if they gave one), the question itself,
>   and a button through to `/secretgarden`.
> - **Reply-To** is set to the asker's email when they left one, so hitting reply in
>   Gmail goes to the guest rather than to yourselves.
> - Wrapped in try/catch exactly like the RSVP send: if Resend is down the question is
>   still saved and the guest still gets their success screen; the failure just lands in
>   the server log.
> - It reuses the normal email shell but signs off "Sent automatically by the wedding
>   site." instead of "With love, Adam & Mady" — `emailShell` gained an optional
>   sign-off argument for that. The guest-facing emails are unchanged.

---

Open questions / things I did not touch:

- **Date format elsewhere on the site.** Your notes were about the emails, so that's all
  I changed. `July 10th, 2027` (with the comma) is still used in
  [layout.tsx](src/app/layout.tsx#L28), [Footer.tsx](src/components/Footer.tsx#L12),
  [Navigation.tsx](src/components/Navigation.tsx#L126),
  [tldr/page.tsx](src/app/(main)/tldr/page.tsx#L20) and a comment in
  [globals.css](src/app/globals.css#L16). Say the word and I'll make it consistent
  site-wide.
- **The notification goes out on every question,** with no batching or rate limit. Fine
  for a wedding; worth knowing if someone spams the form.
- **Not verified against a real inbox.** Typecheck and lint are clean, but nothing was
  actually sent — that needs a `RESEND_API_KEY` and a live submission.
