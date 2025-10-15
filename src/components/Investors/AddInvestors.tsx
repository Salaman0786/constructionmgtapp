import React, { useState } from "react";
import { X, Mail } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInvestors: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-lg font-semibold text-gray-800">
            Add New Investor
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
          Enter investor details and upload KYC documents
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none pr-8"
              />
              <Mail
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="number"
              name="phone"
              placeholder="+12589652312"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nationality *
            </label>
            <select
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option value="">Select nationality</option>
              <option value="ethiopion">Ethiopion</option>
              <option value="american">American</option>
              <option value="british">British</option>
              <option value="canadian">Canadian</option>
              <option value="saudi aribian">Saudi Aribian</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Investment Amount *
            </label>
            <input
              type="number"
              name="amount"
              placeholder="85000"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
          {/* Temporary Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              KYC Documents *
            </label>
            <input
              type="file"
              name="documents"
              placeholder="Drag & drop file"
              value={form.documents}
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
              Create Investor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestors;
