import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInvoice: React.FC<AddInvoiceModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    investor: "",
    unit: "",
    amount: "",
    currency: "USD",
    dueDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Invoice Data:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Create New Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Generate an invoice for unit payment
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Investor */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Investor *
            </label>
            <select
              name="investor"
              value={form.investor}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select investor</option>
              <option value="Investor A">Investor A</option>
              <option value="Investor B">Investor B</option>
              <option value="Investor C">Investor C</option>
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm font-medium text-gray-700">Unit *</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select unit</option>
              <option value="A-101">A-101</option>
              <option value="B-205">B-205</option>
              <option value="C-301">C-301</option>
            </select>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                placeholder="15000"
                value={form.amount}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Currency *
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <div className="relative">
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm pr-10 focus:ring-2 focus:ring-purple-600 outline-none"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoice;
