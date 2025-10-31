import React from "react";

interface BudgetUtilizationProps {
  percentage: number;
}

const BudgetUtilization: React.FC<BudgetUtilizationProps> = ({
  percentage,
}) => {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      {/* Title and Percentage Label */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          Overall Budget Utilization
        </h3>
        <span className="text-xs font-semibold bg-[#4b0082] text-white px-2 py-1 rounded-full">
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-[#4b0082] transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetUtilization;
