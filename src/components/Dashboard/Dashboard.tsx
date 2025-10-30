import ActiveProjectsTimeline from "./ActiveProjectsTimeline";

import CashFlowChart from "./CashFlowChart";
import DashboardHeader from "./DashboardHeader";
import MyTasks from "./MyTasks";
import RecentDocuments from "./RecentDocuments";
import ReorderAlerts from "./ReorderAlerts";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-10xl mx-auto pt-4">
        <ActiveProjectsTimeline />
        <CashFlowChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-10xl mx-auto pt-4">
        <MyTasks />
        <RecentDocuments />
        <ReorderAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
