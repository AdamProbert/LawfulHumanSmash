export interface Chapter {
  href: string;
  label: string;
}

/** Ordered "chapters" of the book. Order drives page-turn navigation. */
export const CHAPTERS: Chapter[] = [
  { href: "/tldr", label: "Details" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/qa", label: "Q&A" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/food-drinks", label: "Food & Drinks" },
  { href: "/itinerary", label: "Itinerary" },
];
