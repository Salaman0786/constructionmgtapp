import ArApAgingChart from "./ArApAgingChart";
import DashboardHeader from "./DashboardHeader";
import FxRateChart from "./FxRateChart";
import LowStockAlerts from "./LowStockAlerts";
import UnitsPerformanceChart from "./UnitsPerformanceChart";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-10xl mx-auto pt-4">
        <UnitsPerformanceChart />
        <ArApAgingChart />
        <FxRateChart />
        <LowStockAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
