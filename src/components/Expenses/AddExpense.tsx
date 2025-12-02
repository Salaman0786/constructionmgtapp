import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddExpense: React.FC<RecordExpenseModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    category: "",
    description: "",
    amount: "",
    currency: "USD",
    vendor: "",
    date: "",
    notes: "",
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Record New Expense
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtext */}
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Add a new project expense with details
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select category</option>
              <option value="Travel">Travel</option>
              <option value="Supplies">Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <input
              type="text"
              name="description"
              placeholder="Brief description of the expense"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                placeholder="1500"
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

          {/* Vendor/Supplier */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Vendor/Supplier
            </label>
            <input
              type="text"
              name="vendor"
              placeholder="Vendor or supplier name (optional)"
              value={form.vendor}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Date *</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={form.date}
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

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Memo/Notes
            </label>
            <textarea
              name="notes"
              placeholder="Additional notes or details about this expense"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none resize-none"
            ></textarea>
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
              Record Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
