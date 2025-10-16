import React from "react";
import Card from "./Card";

interface StockItem {
  name: string;
  current: number;
  minimum: number;
  status: "Low" | "Critical";
}

const stockItems: StockItem[] = [
  { name: "Cement Bags (50kg)", current: 85, minimum: 100, status: "Low" },
  { name: "Steel Rebar (12mm)", current: 45, minimum: 75, status: "Critical" },
  { name: "Paint - White (5L)", current: 18, minimum: 25, status: "Low" },
  {
    name: "Electrical Wire (2.5mm)",
    current: 12,
    minimum: 30,
    status: "Critical",
  },
];

const LowStockAlerts: React.FC = () => {
  return (
    <Card title="Low Stock Alerts">
      <p className="text-sm text-gray-500 mb-3">Items requiring attention</p>

      <div className="space-y-3">
        {stockItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.current} / {item.minimum} minimum
              </p>
            </div>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded-md ${
                item.status === "Critical"
                  ? "bg-red-100 text-red-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LowStockAlerts;
