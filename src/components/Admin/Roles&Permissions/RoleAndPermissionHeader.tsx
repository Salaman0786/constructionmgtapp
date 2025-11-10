import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddRole from "./AddRole";

const PurchaseRequestDashboard: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Roles & Permissions
        </h1>
        <p className="text-sm text-gray-500">
          Manage user roles and access control
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Add Role
        </button>
      </div>
      <AddRole isOpen={openModal} onClose={() => setOpenModal(false)} />
      {/*  */}
    </div>
  );
};

export default PurchaseRequestDashboard;
