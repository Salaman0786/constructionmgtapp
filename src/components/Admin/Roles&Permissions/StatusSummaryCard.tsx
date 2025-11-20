import { Shield, Lock, Users, CheckCircle } from "lucide-react";
import { useGetRolesDashboardQuery } from "../../../features/role/api/roleApi";

const StatusSummaryCard = () => {
  const { data, isLoading, isError } = useGetRolesDashboardQuery(undefined);
  return (
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
          <p className="text-sm text-gray-600">Modules</p>

          <h3 className="text-xl font-semibold text-gray-800 mt-1">
            {isLoading ? "..." : data?.data?.totalParentModules ?? 0}
          </h3>
        </div>
        <div className="w-10 h-10 bg-[#6464ED] flex items-center justify-center rounded-full">
          <Lock className="text-white" size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatusSummaryCard;
