export interface FlashcardReview {
  easeFactor: number;      // How easy the card is (default 2.5)
  interval: number;        // Days until next review
  repetitions: number;     // Number of successful reviews in a row
}

/**
 * Update the flashcard review state based on the quality of the review.
 * @param review - Current review state of the flashcard
 * @param quality - Quality of recall (0-5 scale, 5 = perfect recall)
 * @returns Updated review state with new interval, repetitions, easeFactor
 */
export function scheduleNextReview(review: FlashcardReview, quality: number): FlashcardReview {
  let { easeFactor, interval, repetitions } = review;

  // Clamp quality to 0-5
  quality = Math.min(Math.max(quality, 0), 5);

  if (quality < 3) {
    // Reset repetitions if recall was poor
    repetitions = 0;
    interval = 1;
  } else {
    // Increase repetitions count
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      // Calculate next interval based on ease factor
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor based on quality (minimum 1.3)
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  return {
    easeFactor,
    interval,
    repetitions,
  };
}