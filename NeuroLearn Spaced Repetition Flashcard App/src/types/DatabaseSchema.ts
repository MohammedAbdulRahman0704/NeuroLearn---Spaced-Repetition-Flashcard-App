// types/DatabaseSchema.ts

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Deck {
  id: number;
  userId: number;
  title: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: number;
  deckId: number;
  front: string;
  back: string;
  frontType: string;
  backType: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  interval: number;
  easeFactor: number;
  tags?: string[];  // Used temporarily during create/update
}

export interface Review {
  id: number;
  userId: number;
  flashcardId: number;
  reviewDate: string;
  rating: 'easy' | 'good' | 'hard' | 'again';
  timeSpent: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface FlashcardTag {
  id: number;
  flashcardId: number;
  tagId: number;
}

export interface Settings {
  userId: number;
  theme: string;
  newCardsPerDay: number;
  maxReviewsPerDay: number;
  showTimer: boolean;
}

export interface DatabaseSchema {
  users: User[];
  decks: Deck[];
  flashcards: Flashcard[];
  reviews: Review[];
  tags: Tag[];
  flashcardTags: FlashcardTag[];
  settings: Settings[];
}