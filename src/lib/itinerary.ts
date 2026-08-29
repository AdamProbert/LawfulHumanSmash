export type SlotKind = "act" | "interstitial";
export type SlotTone = "day" | "dusk" | "night";

/** One row of the running order, as the Itinerary page renders it. */
export interface ItinerarySlot {
  id: string;
  /** Minutes past midnight, driving the "now" marker on the day itself. */
  atMinutes: number;
  time: string;
  title: string;
  /** Acts get billed large; interstitials sit quietly between them. */
  kind: SlotKind;
  /** Where the row sits in the day→night wash. */
  tone: SlotTone;
  billing: string | null;
  description: string;
  isVisible: boolean;
}

export const SLOT_KINDS: { id: SlotKind; label: string }[] = [
  { id: "act", label: "Act" },
  { id: "interstitial", label: "Interstitial" },
];

export const SLOT_TONES: { id: SlotTone; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "dusk", label: "Dusk" },
  { id: "night", label: "Night" },
];

/**
 * The running order as it was hardcoded before the itinerary moved into the
 * database. It seeds a fresh database and is what the Itinerary page falls
 * back to if the API is unreachable or the table is empty, so the page is
 * never blank.
 */
export const DEFAULT_SET_LIST: Omit<ItinerarySlot, "id">[] = [
  {
    atMinutes: 12 * 60 + 30,
    time: "12:30",
    title: "Doors",
    kind: "interstitial",
    tone: "day",
    billing: null,
    description: "Roll up, say hello, grab a drink and find a spot.",
    isVisible: true,
  },
  {
    atMinutes: 13 * 60 + 30,
    time: "1:30",
    title: "The Ceremony",
    kind: "act",
    tone: "day",
    billing: "The main event",
    description: "Seats please.",
    isVisible: true,
  },
  {
    atMinutes: 14 * 60,
    time: "2:00",
    title: "Intermission",
    kind: "interstitial",
    tone: "day",
    billing: null,
    description: "Drinks, games and pictures out on the grounds.",
    isVisible: true,
  },
  {
    atMinutes: 15 * 60 + 30,
    time: "3:30",
    title: "Lunch & speeches",
    kind: "interstitial",
    tone: "day",
    billing: null,
    description: "Food, toasts, and a few words from the usual suspects.",
    isVisible: true,
  },
  {
    atMinutes: 18 * 60,
    time: "6:00",
    title: "Oceanview",
    kind: "act",
    tone: "dusk",
    billing: "Set one",
    description: "Settle back in, the first band takes over.",
    isVisible: true,
  },
  {
    atMinutes: 19 * 60 + 30,
    time: "7:30",
    title: "First dance",
    kind: "interstitial",
    tone: "dusk",
    billing: null,
    description: "Ours. Then the floor is all yours.",
    isVisible: true,
  },
  {
    atMinutes: 19 * 60 + 40,
    time: "7:40",
    title: "Oceanview",
    kind: "act",
    tone: "dusk",
    billing: "Set two",
    description: "And it gets loud.",
    isVisible: true,
  },
  {
    atMinutes: 20 * 60 + 30,
    time: "8:30",
    title: "Pizzas",
    kind: "interstitial",
    tone: "night",
    billing: null,
    description: "Late-night slices to keep you going.",
    isVisible: true,
  },
  {
    atMinutes: 21 * 60,
    time: "9:00",
    title: "Democracy Manifest",
    kind: "act",
    tone: "night",
    billing: "Headline",
    description: "Two sets across two hours. Bring your rocking shoes!",
    isVisible: true,
  },
  {
    atMinutes: 23 * 60,
    time: "11:00",
    title: "Home time",
    kind: "interstitial",
    tone: "night",
    billing: null,
    description: "Last orders and off you go.",
    isVisible: true,
  },
];

/**
 * Parse a display time ("7:40", "19:40", "8:30 pm") into minutes past
 * midnight, so an admin only has to type the time once. Bare hours below 12
 * with no meridiem are read as afternoon: the day starts at 12:30, so "1:30"
 * means half one, never half one in the morning.
 */
export function parseTimeToMinutes(input: string): number | null {
  const match = input.trim().match(/^(\d{1,2})[:.](\d{2})\s*(am|pm)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours > 23 || minutes > 59) return null;

  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  else if (meridiem === "am" && hours === 12) hours = 0;
  else if (!meridiem && hours < 12) hours += 12;

  return hours * 60 + minutes;
}

/** "20:30" for an atMinutes value, for admin display. */
export function formatMinutes(atMinutes: number): string {
  const hours = Math.floor(atMinutes / 60);
  const minutes = atMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
