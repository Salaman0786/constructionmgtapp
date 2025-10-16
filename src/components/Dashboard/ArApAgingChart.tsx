import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";

const data = [
  { name: "Jan", receivable: 280000, payable: 180000 },
  { name: "Feb", receivable: 300000, payable: 160000 },
  { name: "Mar", receivable: 310000, payable: 190000 },
  { name: "Apr", receivable: 290000, payable: 170000 },
  { name: "May", receivable: 330000, payable: 200000 },
  { name: "Jun", receivable: 350000, payable: 220000 },
];

const ArApAgingChart: React.FC = () => {
  return (
    <Card title="AR/AP Aging" subtitle="Accounts receivable vs payable trends">
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ fill: "#f9f9f9" }} />
            <Area
              type="monotone"
              dataKey="receivable"
              stackId="1"
              stroke="#6A0DAD"
              fill="#6A0DAD"
              fillOpacity={0.9}
            />
            <Area
              type="monotone"
              dataKey="payable"
              stackId="1"
              stroke="#FFD580"
              fill="#FFD580"
              fillOpacity={0.9}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legends Below Chart */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#6A0DAD] rounded-sm"></span>
          <span className="text-xs text-gray-600">Accounts Receivable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FFD580] rounded-sm"></span>
          <span className="text-xs text-gray-600">Accounts Payable</span>
        </div>
      </div>
    </Card>
  );
};

export default ArApAgingChart;
