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
      className="w-80 h-52 cursor-pointer relative focus:outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onFlip?.();
      }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full p-5 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 backface-hidden">
          <p className="text-center text-lg font-semibold">{question}</p>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full p-5 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-lg border border-indigo-700 rotate-y-180 backface-hidden">
          <p className="text-center text-lg font-semibold">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;