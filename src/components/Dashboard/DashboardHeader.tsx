import React from "react";
import { Folder, Users, FileText, ListTodo } from "lucide-react";
import { StatCardShimmer } from "./StartCardShimmer";
import { useSelector } from "react-redux";

interface StatCardProps {
  title: string;
  value: string | number;
  subText?: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subText,
  icon,
  iconBg,
  valueColor,
}) => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl shadow-sm p-5 bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
      </div>

      <h2
        className={`text-2xl font-semibold mt-2 ${
          valueColor ?? "text-gray-900"
        }`}
      >
        {value}
      </h2>

      {subText && <p className="text-sm text-gray-500 mt-1">{subText}</p>}
    </div>
  );
};

interface DashboardHeaderProps {
  topStats: {
    totalProjects: number;
    totalTasks: number;
    totalUsers: number;
    totalDocuments: number;
  };
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  topStats,
  isLoading,
}) => {
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const isInvestor = userRole === "INVESTOR";
  const isManager = userRole === "MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Dashboard Overview
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Complete overview of project progress & system metrics.
      </p>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isManager || isInvestor ? "md:grid-cols-3" : "md:grid-cols-4"
        } gap-4`}
      >
        {isLoading ? (
          <>
            <StatCardShimmer />
            <StatCardShimmer />
            <StatCardShimmer />
            {(!isManager || !isInvestor) && <StatCardShimmer />}
          </>
        ) : (
          <>
            {/* ✅ Total Projects */}
            <StatCard
              title="Total Projects"
              value={topStats?.totalProjects ?? 0}
              subText="All projects in system"
              icon={<Folder className="w-5 h-5 text-blue-600" />}
              iconBg="bg-blue-100"
            />

            {/* ✅ Total Tasks */}
            <StatCard
              title="Total Tasks"
              value={topStats?.totalTasks ?? 0}
              subText="Tasks across all projects"
              icon={<ListTodo className="w-5 h-5 text-green-600" />}
              iconBg="bg-green-100"
            />

            {/* ✅ Total Users */}
            {isSuperAdmin && (
              <StatCard
                title="Total Users"
                value={topStats?.totalUsers ?? 0}
                subText="Registered users"
                icon={<Users className="w-5 h-5 text-purple-600" />}
                iconBg="bg-purple-100"
              />
            )}

            {/* ✅ Total Documents */}
            {(isManager || isSuperAdmin) && (
              <StatCard
                title="Total Documents"
                value={topStats?.totalDocuments ?? 0}
                subText="Uploaded project documents"
                icon={<FileText className="w-5 h-5 text-orange-600" />}
                iconBg="bg-orange-100"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
