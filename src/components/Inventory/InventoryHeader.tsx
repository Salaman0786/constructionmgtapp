import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import AddUnits from "../Units/AddUnits";

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

const InventoryHeader: React.FC = () => {
  const [openAddRole, setOpenAddRole] = useState(false);
  const handleCreateRole = (roleData: any) => {};
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mb-6">
            Manage stock levels and track material movements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-3 text-[#4b0082] hover:bg-[#e1d8e8] border bg-white text-sm px-3 py-2 rounded-md"
            onClick={() => setOpenAddRole(true)}
          >
            <TrendingUp size={16} /> Stock In (GRN)
          </button>
          <button
            className="flex items-center gap-3 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
            onClick={() => setOpenAddRole(true)}
          >
            <TrendingDown size={16} /> Stock Out(Issue)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={4} />
        <StatCard title="Total Value" value={"$3,587.5"} />
        <StatCard
          title="Low Stock Alerts"
          value={3}
          valueColor="text-orange-600"
        />
        <StatCard title="Recent Transactions" value={3} />
      </div>
      <AddUnits
        isOpen={openAddRole}
        onClose={() => setOpenAddRole(false)}
        onCreateRole={handleCreateRole}
      />
    </div>
  );
};

export default InventoryHeader;
