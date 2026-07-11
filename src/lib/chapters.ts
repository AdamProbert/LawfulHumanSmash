export interface Chapter {
  href: string;
  label: string;
}

/** Ordered "chapters" of the book. Order drives page-turn navigation. */
export const CHAPTERS: Chapter[] = [
  { href: "/tldr", label: "Details" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/qa", label: "Q&A" },
  { href: "/accommodation", label: "Stay" },
  { href: "/food-drinks", label: "Food & Drinks" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/itinerary", label: "Itinerary" },
];
