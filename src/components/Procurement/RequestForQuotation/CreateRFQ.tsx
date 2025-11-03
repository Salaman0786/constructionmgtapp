import React, { useState } from "react";
import { X } from "lucide-react";

interface CreateRFQProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRFQ: React.FC<CreateRFQProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    purchaseRequest: "",
    dueDate: "",
    rfqTitle: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("RFQ Created:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-semibold text-gray-800">
            Create Request for Quotation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Purchase Request */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Request <span className="text-red-500">*</span>
            </label>
            <select
              name="purchaseRequest"
              value={form.purchaseRequest}
              onChange={handleChange}
              required
              className="w-full mt-1 border bg-[#F2F2F2] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select PR</option>
              <option value="PR-2025-001">PR-2025-001</option>
              <option value="PR-2025-002">PR-2025-002</option>
              <option value="PR-2025-003">PR-2025-003</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#F2F2F2] border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* RFQ Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              RFQ Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="rfqTitle"
              value={form.rfqTitle}
              onChange={handleChange}
              required
              placeholder="Enter RFQ title"
              className="w-full mt-1 border bg-[#F2F2F2]  border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5e1aa3]"
            >
              Create RFQ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;
