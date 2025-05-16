export const INITIAL_INTERVAL_DAYS = 1;

export const MIN_EASE_FACTOR = 1.3;
export const MAX_EASE_FACTOR = 2.5;

export const EASE_FACTOR_DECREASE = 0.15;
export const EASE_FACTOR_INCREASE = 0.1;

export const INTERVAL_MULTIPLIERS = {
  again: 0,      // Card failed, reset interval
  hard: 1.2,     // Hard review - small increase
  good: 2.5,     // Normal review
  easy: 3.5,     // Easy review - bigger increase
};

export enum ReviewGrade {
  Again = 0,
  Hard = 1,
  Good = 2,
  Easy = 3,
}

// Optional: max interval cap (in days)
export const MAX_INTERVAL_DAYS = 365;
