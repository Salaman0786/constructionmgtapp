import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, valueColor }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-lg shadow-sm p-5 min-w-[110px] min-h-[100px]">
      <p className="text-sm text-gray-700 font-medium">{title}</p>
      <div>
        <p className={`text-lg font-semibold ${valueColor ?? "text-black"}`}>
          {value}
        </p>
        {/* {title === "Variance" && (
          <p className="text-sm text-gray-700 font-medium">{title}</p>
        )} */}
      </div>
    </div>
  );
};

const BOQDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">BOQ Management</h1>
      <p className="text-sm text-gray-500 mb-6">
        Organize, Estimate & Control Project Costs
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total BOQ Items" value={125} />
        <StatCard title="Total Estimated Cost" value={"$2.45M"} />
        <StatCard
          title="Total Actual Cost"
          value={"$2.31M"}
          valueColor="text-orange-600"
        />
        <StatCard title="Variance" value={"$140K"} />
      </div>
    </div>
  );
};

export default BOQDashboard;
