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

const AccountsDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Accounts Receivable Report
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Outstanding invoices and payment status
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Outstanding" value={"$45,000"} />
        <StatCard title="Overdue Amount" value={"$15,000"} />
        <StatCard title="Current Amount" value={"$30,000"} />
        <StatCard title="Collection Rate" value={"36%"} />
      </div>
    </div>
  );
};

export default AccountsDashboard;
