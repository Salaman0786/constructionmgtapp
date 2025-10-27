import React, { useState } from "react";
import { X, Mail } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBOQ: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    amount: "",
    documents: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user data:", form);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto p-6 ">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Add BOQ</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Enter details as per your standard BOQ format.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Item Code *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter item code"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <div className="relative">
              <textarea
                name="description"
                placeholder="Enter description"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none resize-y min-h-[100px]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Unit *</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter unit"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="Enter category"
              value={form.nationality}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select category</option>
              <option value="ethiopion">Civil</option>
              {/* <option value="american">American</option>
              <option value="british">British</option>
              <option value="canadian">Canadian</option>
              <option value="saudi aribian">Saudi Aribian</option>
              <option value="others">Others</option> */}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Work Package *
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter work package"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
          {/* Temporary Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Estimated Rate (INR) *
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter estimated rate (INR)"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Estimated Qty *
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter estimated Qty"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Actual Qty (optional) *
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter actual Qty (optional)"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Supplier *
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter supplier"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
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
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:[#4b0089]"
            >
              Create BOQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBOQ;
