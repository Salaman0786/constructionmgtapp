import ForeignExchangeDashboard from "./ForeignExchangeDashboard";
import { ForeignExchangeTable } from "./ForeignExchangedTable";

const ForeignExchange = () => {
  return (
    <div className="p-6">
      <ForeignExchangeDashboard />
      <ForeignExchangeTable />
    </div>
  );
};

export default ForeignExchange;
