/**
 * Returns the current date in YYYY-MM-DD format.
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Adds a given number of days to a date string and returns a new date string.
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param days - Number of days to add
 * @returns New date string in YYYY-MM-DD format
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Checks if a flashcard is due for review.
 * @param lastReviewDate - Last review date string in YYYY-MM-DD format
 * @param interval - Interval in days until next review
 * @returns True if card is due today or overdue, else false
 */
export function isDueForReview(lastReviewDate: string, interval: number): boolean {
  const dueDate = addDays(lastReviewDate, interval);
  const today = getTodayDate();
  return today >= dueDate;
}

/**
 * Formats an interval (number of days) into a human-readable string.
 * @param interval - Number of days
 * @returns Formatted string, e.g., "1 day", "5 days"
 */
export function formatInterval(interval: number): string {
  return interval === 1 ? '1 day' : `${interval} days`;
}