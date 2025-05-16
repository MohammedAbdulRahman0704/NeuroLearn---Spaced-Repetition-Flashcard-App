import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: { name: string; progress: number }[]; // Array of items with a name and progress (0-100)
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="progress" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
