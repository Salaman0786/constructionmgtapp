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

const UnitsHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Units</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage residential and commercial units
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Units" value={3} />
        <StatCard title="Available" value={1} valueColor="text-green-600" />
        <StatCard title="Sold" value={1} valueColor="text-blue-600" />
        <StatCard title="Total Value" value={"$320,000"} />
      </div>
    </div>
  );
};

export default UnitsHeader;
