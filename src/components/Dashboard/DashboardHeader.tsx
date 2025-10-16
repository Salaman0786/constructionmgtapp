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
      <p className={`text-lg font-semibold ${valueColor ?? "text-black"}`}>
        {value}
      </p>
    </div>
  );
};

const DashboardHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        Welcome back! Here's what's happening with your projects.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Investors" value={247} />
        <StatCard title="Units Sold" value={177 / 285} />
        <StatCard title="Total Revenue" value={"$2.4M"} />
        <StatCard
          title="Pending Items"
          value={"23"}
          valueColor="text-orange-600"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
