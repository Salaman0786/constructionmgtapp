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

const AdminPanelHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      <p className="text-sm text-gray-500 mb-6">
        User management and role administration
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={4} />
        <StatCard title="Active Users" value={3} valueColor="text-green-600" />
        <StatCard title="Total Roles" value={4} />
        <StatCard title="Custom Roles" value={3} />
      </div>
    </div>
  );
};

export default AdminPanelHeader;
