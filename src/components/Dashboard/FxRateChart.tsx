import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import { ArrowUpRight } from "lucide-react";

const data = [
  { day: "Mon", rate: 54.21 },
  { day: "Tue", rate: 54.1 },
  { day: "Wed", rate: 54.3 },
  { day: "Thu", rate: 54.45 },
  { day: "Fri", rate: 54.55 },
  { day: "Sat", rate: 54.35 },
  { day: "Sun", rate: 54.4 },
];

const FxRateChart: React.FC = () => {
  return (
    <Card title="FX Rate: USD → ETB">
      <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
        <span>Current:</span>
        <span className="font-medium">54.41 ETB</span>
        <span className="text-green-600 text-xs flex items-center gap-0.5">
          (+0.03)
          <ArrowUpRight size={12} />
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis domain={["54.00", "54.60"]} />
            <Tooltip cursor={{ fill: "#f9f9f9" }} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#4B0082"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4B0082" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FxRateChart;
