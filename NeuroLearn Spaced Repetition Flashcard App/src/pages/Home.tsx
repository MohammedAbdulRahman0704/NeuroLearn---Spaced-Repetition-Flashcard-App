// pages/Home.tsx
import React, { useState } from 'react';
import FlashcardForm from '../components/flashcard/form/FlashcardForm';
import Flashcard from '../components/flashcard/ui/Flashcard';

const Home: React.FC = () => {
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleAddCard = (question: string, answer: string) => {
    setCards([...cards, { question, answer }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-8">
      <FlashcardForm onSubmit={handleAddCard} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Flashcard
            key={index}
            question={card.question}
            answer={card.answer}
            isFlipped={flippedIndex === index}
            onFlip={() => setFlippedIndex(flippedIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;