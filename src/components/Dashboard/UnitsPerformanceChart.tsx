import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";

const data = [
  { name: "Q1", sold: 33, available: 45 },
  { name: "Q2", sold: 43, available: 40 },
  { name: "Q3", sold: 47, available: 32 },
  { name: "Q4", sold: 50, available: 28 },
];

const UnitsPerformanceChart: React.FC = () => {
  return (
    <Card title="Units Performance" subtitle="Quarterly sales vs availability">
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: "#f9f9f9" }} />
            <Bar dataKey="available" fill="#E5D8FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" fill="#4B0082" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legends Below Chart */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#4B0082] rounded-sm"></span>
          <span className="text-xs text-gray-600">Units Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#E5D8FF] rounded-sm border border-gray-200"></span>
          <span className="text-xs text-gray-600">Units Available</span>
        </div>
      </div>
    </Card>
  );
};

export default UnitsPerformanceChart;
