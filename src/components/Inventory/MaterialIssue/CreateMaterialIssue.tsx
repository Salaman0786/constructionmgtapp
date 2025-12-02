import React, { useState } from "react";
import { X } from "lucide-react";

interface CreateMaterialIssueProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMaterialIssue: React.FC<CreateMaterialIssueProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    project: "",
    issueTo: "",
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
            Issue Material
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
          <div className="grid grid-cols-1">
            <div>
              <label className="text-sm font-medium text-black">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={form.project}
                onChange={handleChange}
                required
                className="w-full mt-1 bg-[#F2F2F2] border placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select Project</option>
                <option value="Residential Complex Phase 1">Residential Complex Phase 1</option>
                <option value="Commercial Plaza">Commercial Plaza</option>
                 <option value="Infrastructure Upgrade">Infrastructure Upgrade</option>
                	

              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1">
            <div>
              <label className="text-sm font-medium text-black">
                Issue To  <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="issueTo"
                value={form.issueTo}
                onChange={handleChange}
                required
                placeholder="Name or Employee ID"
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
             Issue
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

export default CreateMaterialIssue;
