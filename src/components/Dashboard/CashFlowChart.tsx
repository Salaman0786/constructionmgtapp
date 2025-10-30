import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", inflow: 400000, outflow: 200000 },
  { month: "Feb", inflow: 550000, outflow: 300000 },
  { month: "Mar", inflow: 500000, outflow: 280000 },
  { month: "Apr", inflow: 750000, outflow: 360000 },
  { month: "May", inflow: 850000, outflow: 340000 },
  { month: "Jun", inflow: 1100000, outflow: 370000 },
];

const CashFlowChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Cash Flow (6 Months)
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Current projects and milestones
      </p>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="inflow"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22C55E", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="outflow"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#EF4444", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
