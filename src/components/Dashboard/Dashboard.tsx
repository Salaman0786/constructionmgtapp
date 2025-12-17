import { useSelector } from "react-redux";
import { useGetDashboardQuery } from "../../features/dashboard/api/dashboardApi";
import { showError } from "../../utils/toast";
import ActiveProjectsTimeline from "./ActiveProjectsTimeline";
import ActiveUsers from "./ActiveUsers";

// import CashFlowChart from "./CashFlowChart";
import DashboardHeader from "./DashboardHeader";
import MyTasks from "./MyTasks";
import RecentDocuments from "./RecentDocuments";
// import ReorderAlerts from "./ReorderAlerts";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const isManager = userRole === "MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isUser = userRole === "USER";
  if (isError) {
    showError("Failed to loading Dashboard");
  }
  const dashboard = data?.data;

  return (
    <div>
      <DashboardHeader topStats={dashboard?.topStats} isLoading={isLoading} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-10xl mx-auto pt-4">
        <ActiveProjectsTimeline
          projects={dashboard?.activeProjects}
          isLoading={isLoading}
        />
        {isSuperAdmin && (
          <ActiveUsers users={dashboard?.recentUsers} isLoading={isLoading} />
        )}
        {isUser && (
          <MyTasks tasks={dashboard?.recentTasks} isLoading={isLoading} />
        )}
        {/* <CashFlowChart /> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-10xl mx-auto pt-4">
        {(isManager || isSuperAdmin) && (
          <MyTasks tasks={dashboard?.recentTasks} isLoading={isLoading} />
        )}
        {(isManager || isSuperAdmin) && (
          <RecentDocuments
            documents={dashboard?.recentDocuments}
            isLoading={isLoading}
          />
        )}
        {/* <ReorderAlerts /> */}
      </div>
    </div>
  );
};

export default Dashboard;
