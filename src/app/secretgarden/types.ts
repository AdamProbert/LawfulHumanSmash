/** Shapes the admin panel receives from the /api/admin/* endpoints. */

export interface AdminQuestion {
  id: string;
  name: string;
  email: string | null;
  question: string;
  answer: string | null;
  isAnswered: boolean;
  isHidden: boolean;
  /** "guest" if asked through the site, "admin" if we wrote it ourselves. */
  source: string;
  createdAt: string;
}

export interface AdminDrinkChoice {
  id: string;
  name: string;
  emoji: string;
}

export interface AdminGuest {
  id: string;
  name: string;
  /** null until they reply. */
  attending: boolean | null;
  dietaryRequirements: string | null;
  rsvpSubmittedAt: string | null;
  drinks: AdminDrinkChoice[];
}

export interface AdminParty {
  id: string;
  code: string;
  email: string | null;
  createdAt: string;
  guests: AdminGuest[];
}

export interface AdminDrinkVoter {
  guestId: string;
  name: string;
  attending: boolean | null;
  partyCode: string;
  votedAt: string;
}

export interface AdminDrink {
  id: string;
  name: string;
  emoji: string;
  color: string;
  voteCount: number;
  voters: AdminDrinkVoter[];
}

export interface AdminItinerarySlot {
  id: string;
  atMinutes: number;
  time: string;
  title: string;
  kind: string;
  tone: string;
  billing: string | null;
  description: string;
  isVisible: boolean;
}
