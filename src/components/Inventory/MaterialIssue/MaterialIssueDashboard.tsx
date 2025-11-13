import { Plus } from "lucide-react";
import React, { useState } from "react";
import CreateMaterialIssue from "./CreateMaterialIssue"

const MaterialIssueDashboard: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Material Issue</h1>
        <p className="text-sm text-gray-500">
          Issue stock to site with history log
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Issue Material
        </button>
      </div>
      <CreateMaterialIssue isOpen={openModal} onClose={() => setOpenModal(false)} />
      {/*  */}
    </div>
  );
};

export default MaterialIssueDashboard;
