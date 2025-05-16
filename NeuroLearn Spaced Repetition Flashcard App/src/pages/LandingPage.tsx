import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Brain, Zap, BarChart } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      name: 'Smart Learning',
      description: 'Utilize spaced repetition for optimal memory retention',
      icon: Brain,
    },
    {
      name: 'Quick Review',
      description: 'Efficiently review cards with our intuitive interface',
      icon: Zap,
    },
    {
      name: 'Track Progress',
      description: 'Monitor your learning progress with detailed analytics',
      icon: BarChart,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Layout className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Master Any Subject with Smart Flashcards
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Enhance your learning with our intelligent flashcard system. Using spaced repetition, we help you remember more while studying less.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.name} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-center">
                      <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;