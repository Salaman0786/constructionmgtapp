import React, { useState } from "react";
import { X } from "lucide-react";

interface AddRoleProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGRN: React.FC<AddRoleProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    purchaseOrder: "",
    receivedDate: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Goods Received Note
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
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">
                Purchase Order <span className="text-red-500">*</span>
              </label>
              <select
                name="purchaseOrder"
                value={form.purchaseOrder}
                onChange={handleChange}
                required
                className="w-full mt-1 bg-[#F2F2F2] border placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select PO</option>
                <option value="RFQ-2025-001">
                  PO-2025-001 - Steel Suppliers LLC
                </option>
                <option value="RFQ-2025-002">
                  PO-2025-002 - ElectroPro Trading
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="receivedDate"
                value={form.receivedDate}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Remarks <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                required
                placeholder="Enter remarks about received goods..."
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5e1aa3]"
            >
              Create Role
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border hover:bg-[#facf6c] hover:border-[#fe9a00] border-gray-300 rounded-md text-sm text-black "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGRN;
