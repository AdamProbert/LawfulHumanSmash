export interface QuestionCategory {
  id: string;
  label: string;
  emoji: string;
}

/** Categories an admin can assign to a question in /secretgarden. */
export const QUESTION_CATEGORIES: QuestionCategory[] = [
  { id: "uncategorized", label: "Uncategorized", emoji: "❔" },
  { id: "accommodation", label: "Accommodation", emoji: "🏡" },
  { id: "whimsy", label: "Whimsy", emoji: "🦋" },
  { id: "pets", label: "Pets", emoji: "🐾" },
];
