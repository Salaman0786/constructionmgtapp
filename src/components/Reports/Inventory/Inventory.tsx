import InventoryDashboard from "./InventoryDashboard";
import { InventoryTable } from "./InventoryTable";

const Inventory = () => {
  return (
    <div className="p-6">
      <InventoryDashboard />
      <InventoryTable />
    </div>
  );
};

export default Inventory;
