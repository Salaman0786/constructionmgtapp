import React from "react";
import { useGetUsersDashboardQuery } from "../../../features/user/api/userApi";
import { Lock, Shield, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, valueColor }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-lg shadow-sm px-4 py-3 min-w-[110px] min-h-[80px]">
      <p className="text-sm text-gray-700 font-medium">{title}</p>
      <p className={`text-lg font-semibold ${valueColor ?? "text-black"}`}>
        {value}
      </p>
    </div>
  );
};

const AdminPanelHeader: React.FC = () => {
  const { data, isLoading, isError } = useGetUsersDashboardQuery(undefined);
  return (
    // <div>
    //   <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
    //   <p className="text-sm text-gray-500 mb-6">
    //     User management and role administration
    //   </p>

    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    //     <StatCard
    //       title="Total Users"
    //       value={isLoading ? "..." : data?.data?.totalUsers ?? 0}
    //     />
    //     <StatCard
    //       title="Active Users"
    //       value={isLoading ? "..." : data?.data?.activeUsers ?? 0}
    //       valueColor="text-green-600"
    //     />
    //     <StatCard
    //       title="Total Roles"
    //       value={isLoading ? "..." : data?.data?.totalRoles ?? 0}
    //     />
    //   </div>
    // </div>
    <div>
      <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      <p className="text-sm text-gray-500 mb-6">
        User management and role administration
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Roles */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Total Roles</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-1">
              {isLoading ? "..." : data?.data?.totalRoles ?? 0}
            </h3>
          </div>
          <div className="w-10 h-10 bg-[#9F49EF] flex items-center justify-center rounded-full">
            <Shield className="text-white" size={20} />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Total Users</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-1">
              {isLoading ? "..." : data?.data?.totalUsers ?? 0}
            </h3>
          </div>
          <div className="w-10 h-10 bg-[#3473EF] flex items-center justify-center rounded-full">
            <Users className="text-white" size={20} />
          </div>
        </div>

        {/* System Roles */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Active Users</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-1">
              {isLoading ? "..." : data?.data?.activeUsers ?? 0}
            </h3>
          </div>
          <div className="w-10 h-10 bg-green-600 flex items-center justify-center rounded-full">
            <Users className="text-white" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelHeader;
