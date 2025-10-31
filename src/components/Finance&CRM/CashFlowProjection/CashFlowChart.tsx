import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Feb 2025", Inflow: 350000, Net: 300000, Outflow: 80000 },
  { name: "Mar 2025", Inflow: 450000, Net: 200000, Outflow: 90000 },
  { name: "Apr 2025", Inflow: 420000, Net: 370000, Outflow: 120000 },
  { name: "May 2025", Inflow: 320000, Net: 400000, Outflow: 50000 },
];

const CashFlowChart: React.FC = () => {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Cash Flow Projection Chart
      </h3>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#888", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              verticalAlign="bottom"
            />
            <Bar dataKey="Inflow" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Outflow" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
