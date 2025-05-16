import React from 'react';
import { useParams } from 'react-router-dom';

const ReviewPage: React.FC = () => {
  const { deckId } = useParams();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Review Cards</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
        Reviewing deck: <span className="font-medium">{deckId}</span>
      </p>
    </div>
  );
};

export default ReviewPage;