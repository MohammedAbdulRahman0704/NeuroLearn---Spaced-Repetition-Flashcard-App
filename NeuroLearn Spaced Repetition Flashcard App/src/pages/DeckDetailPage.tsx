import React from 'react';
import { useParams } from 'react-router-dom';

const DeckDetailPage: React.FC = () => {
  const { deckId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Deck Details</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Deck ID: {deckId}</p>
    </div>
  );
};

export default DeckDetailPage;