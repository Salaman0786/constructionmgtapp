import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { RequiredLabel } from "../../common/RequiredLabel";

interface SubmittalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmittalModal: React.FC<SubmittalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState({
    project: "",
    title: "",
    category: "",
    linkedDrawing: "",
    department: "",
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
    console.log("New Submittal:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-[380px] sm:max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-semibold text-gray-800">
            New Submittal
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
          {/* Select Project */}
          <div>
            <RequiredLabel label="Select Project" />
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            >
              <option value="">Choose a project</option>
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <RequiredLabel label="Title" />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter submittal title"
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
          </div>

          {/* Category */}
          <div>
            <RequiredLabel label="Category" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            >
              <option value="">Select category</option>
              <option value="Structural">Structural</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          {/* Linked Drawing */}
          <div>
            <label className="text-sm text-gray-700">
              Linked Drawing (Optional)
            </label>
            <select
              name="linkedDrawing"
              value={form.linkedDrawing}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            >
              <option value="">Select a drawing</option>
              <option value="Drawing A">Drawing A</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <RequiredLabel label="Department" />
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            >
              <option value="">Select department</option>
              <option value="Structural">Structural</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <RequiredLabel label="Description" />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter detailed description"
              rows={3}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
          </div>

          {/* Upload Files */}
          <div>
            <RequiredLabel label="Upload Files " />
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto mb-2 text-gray-500" />
              <p className="text-xs text-gray-500">
                Drag and drop your drawing file here or click to upload
              </p>
              <button
                type="button"
                className="mt-2 px-3 py-1 border rounded text-sm"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Previous Documents */}
          {/* <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Previous Documents
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="text-xs">floor-plan-v2.pdf</span>
                <div className="flex gap-2">
                  <button className="text-xs border px-2 py-1 rounded">View File</button>
                  <button className="text-xs border px-2 py-1 rounded">Download</button>
                </div>
              </div>
            </div>
          </div> */}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700
              hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]
              disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmittalModal;
