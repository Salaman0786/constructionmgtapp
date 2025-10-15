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

const AccountsPayDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Accounts Payable Report
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Vendor payments and outstanding obligations
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Outstanding" value={"$11,700"} />
        <StatCard
          title="Overdue Amount"
          value={"$3,200"}
          valueColor="text-red-600"
        />
        <StatCard
          title="Due This Month"
          value={"$8,500"}
          valueColor="text-orange-400"
        />
        <StatCard title="Payment Rate" value={"52%"} />
      </div>
    </div>
  );
};

export default AccountsPayDashboard;
