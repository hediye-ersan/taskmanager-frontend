// src/pages/AnalyticsPage.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const completedTasksData = [
  { date: "Apr 6", count: 3 },
  { date: "Apr 7", count: 5 },
  { date: "Apr 8", count: 2 },
  { date: "Apr 9", count: 6 },
  { date: "Apr 10", count: 4 },
  { date: "Apr 11", count: 7 },
  { date: "Apr 12", count: 3 },
];

const averageCompletionTimeData = [
  { date: "Apr 6", avgTime: 2.5 },
  { date: "Apr 7", avgTime: 3 },
  { date: "Apr 8", avgTime: 1.5 },
  { date: "Apr 9", avgTime: 4 },
  { date: "Apr 10", avgTime: 2 },
  { date: "Apr 11", avgTime: 3.2 },
  { date: "Apr 12", avgTime: 2.8 },
];

const priorityDistributionData = [
  { name: "HIGH", value: 12 },
  { name: "MEDIUM", value: 18 },
  { name: "LOW", value: 8 },
];

const COLORS = ["#EF4444", "#F59E0B", "#10B981"];

export default function AnalyticsPage() {
  return (
    <div className=" bg-gray-100 dark:bg-gray-700 p-4 font-caveat">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Analytics</h1>

      <div className="flex gap-4 ">
        {/* Sol Sütun */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Son 7 Günde Tamamlanan Görevler</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={completedTasksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Tamamlanan Görevlerin Ortalama Süresi (Gün)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={averageCompletionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sağ Sütun */}
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-center dark:text-white">Önceliğe Göre Görev Dağılımı</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={priorityDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {priorityDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
