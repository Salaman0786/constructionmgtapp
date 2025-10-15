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

const ForeignExchangeDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Foreign Exchange Report
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Currency conversions and exchange rate history
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Current Rate (USD→ETB)" value={"54.41"} />
        <StatCard title="Total USD Converted" value={"$56,250"} />
        <StatCard title="Total ETB Value" value={"ETB 3,059,737.5"} />
        <StatCard title="Avg Exchange Rate" value={"54.38"} />
      </div>
    </div>
  );
};

export default ForeignExchangeDashboard;
