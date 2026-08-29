export interface Chapter {
  href: string;
  label: string;
}

/** Ordered "chapters" of the book. Order drives page-turn navigation. */
export const CHAPTERS: Chapter[] = [
  { href: "/tldr", label: "Details" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/venue", label: "Venue" },
  { href: "/food-drinks", label: "Food & Drinks" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/qa", label: "Q&A" },
];
