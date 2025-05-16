import React from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  onFlip?: () => void;
  isFlipped?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, isFlipped = false, onFlip }) => {
  return (
    <div
      onClick={onFlip}
      className="w-72 h-48 cursor-pointer perspective"
      aria-label="Flashcard"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onFlip?.();
      }}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front side */}
        <div className="absolute w-full h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md flex items-center justify-center p-4 backface-hidden">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{question}</p>
        </div>

        {/* Back side */}
        <div className="absolute w-full h-full bg-indigo-600 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md flex items-center justify-center p-4 rotate-y-180 backface-hidden">
          <p className="text-lg font-semibold text-white">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;