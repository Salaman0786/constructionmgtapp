import React, { useState } from "react";
import { X } from "lucide-react";

interface AddBOQProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePR: React.FC<AddBOQProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    project: "",
    department: "",
    requiredDate: "",
    priority: "Medium",
    description: "",
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
    console.log("Purchase Request:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Purchase Request
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
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={form.project}
                onChange={handleChange}
                required
                className="w-full mt-1 bg-[#F2F2F2] border placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select project</option>
                <option value="Project A">Project A</option>
                <option value="Project B">Project B</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select department</option>
                <option value="Civil">Civil</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Interior">Interior</option>
                <option value="Structural">Structural</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">
                Required Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C]  border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-black">
              Description / Justification{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Enter description and justification for the request..."
              className="w-full mt-1 border bg-[#F2F2F2] placeholder:text-[#8C8C8C] border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none resize-none min-h-[100px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5e1aa3]"
            >
              Create PR
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

export default CreatePR;
