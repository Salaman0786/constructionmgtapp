import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddModalSubmittals from "./AddModalSubmittal"

const SubmittalsDashboard: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Submittals</h1>
        <p className="text-sm text-gray-500">
          Track submittal approvals and reviews
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> New Submittal
        </button>
      </div>
      <AddModalSubmittals isOpen={openModal} onClose={() => setOpenModal(false)} />
      {/*  */}
    </div>
  );
};

export default SubmittalsDashboard;
