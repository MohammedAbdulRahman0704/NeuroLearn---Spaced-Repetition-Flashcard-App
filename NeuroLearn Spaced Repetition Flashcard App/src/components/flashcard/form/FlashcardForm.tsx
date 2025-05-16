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
    <form 
      onSubmit={handleSubmit} 
      className="max-w-lg w-full mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6"
    >
      <div>
        <label 
          htmlFor="question" 
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Type your question..."
          required
        />
      </div>

      <div>
        <label 
          htmlFor="answer" 
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Type the answer..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Flashcard
      </button>
    </form>
  );
};

export default FlashcardForm;