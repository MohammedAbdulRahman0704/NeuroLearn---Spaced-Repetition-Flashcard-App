import React, { useState } from 'react';

interface FlashcardFormProps {
  onSubmit: (question: string, answer: string) => void;
  initialQuestion?: string;
  initialAnswer?: string;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSubmit, initialQuestion = '', initialAnswer = '' }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSubmit(question.trim(), answer.trim());
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200" htmlFor="question">
        Question
      </label>
      <textarea
        id="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
        placeholder="Enter the question here"
        required
      />

      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200" htmlFor="answer">
        Answer
      </label>
      <textarea
        id="answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 mb-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
        placeholder="Enter the answer here"
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Save Flashcard
      </button>
    </form>
  );
};

export default FlashcardForm;