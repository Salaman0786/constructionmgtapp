import React, { useState } from "react";
import { X } from "lucide-react";

interface CreatePOProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePO: React.FC<CreatePOProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    rfqReference: "",
    vendor: "",
    deliveryDate: "",
    paymentTerms: "",
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
            Create Purchase Order
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
                RFQ Reference <span className="text-red-500">*</span>
              </label>
              <select
                name="rfqReference"
                value={form.rfqReference}
                onChange={handleChange}
                required
                className="w-full mt-1 bg-[#F2F2F2] border placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select RFQ</option>
                <option value="RFQ-2025-001">RFQ-2025-001</option>
                <option value="RFQ-2025-002">RFQ-2025-002</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select Vendor</option>
                <option value="Steel Suppliers LLC">Steel Suppliers LLC</option>
                <option value="ElectroPro Trading">ElectroPro Trading</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">
                Payment Terms <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C]  border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select Terms</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="50% Advance">50% Advance</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5e1aa3]"
            >
              Create PO
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

export default CreatePO;
