import { Filter, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import AddPayment from "./AddPayment";

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

const PaymentsHeader: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mb-6">
            Track and manage invoice payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
          >
            <Plus size={16} /> Add Payment
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Payments" value={3} />
        <StatCard title="Confirmed" value={2} valueColor="text-green-600" />
        <StatCard title="Total Received" value={"$25,000"} />
        <StatCard
          title="Pending"
          value={"$5,000"}
          valueColor="text-orange-600"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0] mt-6">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search Diary (DPR)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>
      <AddPayment isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default PaymentsHeader;
