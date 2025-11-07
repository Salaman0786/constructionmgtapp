import React from "react";

interface CostCategory {
  label: string;
  current: number;
  total: number;
}

const CostBreakdown: React.FC = () => {
  const categories: CostCategory[] = [
    { label: "Material Costs", current: 1.5, total: 2.0 },
    { label: "Labor Costs", current: 0.8, total: 1.2 },
    { label: "Equipment & Machinery", current: 0.5, total: 0.6 },
    { label: "Subcontractor Fees", current: 0.9, total: 1.0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 w-full max-w-4xl mx-auto">
      <h2 className="text-gray-800 font-semibold mb-5 text-lg">
        Cost Breakdown by Category
      </h2>

      <div className="space-y-5">
        {categories.map((item, index) => {
          const percentage = (item.current / item.total) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">
                  ${item.current.toFixed(1)}M / ${item.total.toFixed(1)}M
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostBreakdown;
