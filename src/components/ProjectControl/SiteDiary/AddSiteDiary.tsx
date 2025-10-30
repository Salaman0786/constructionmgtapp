import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

interface DailyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSiteDiary: React.FC<DailyProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState({
    date: "",
    weather: "",
    project: "",
    manpower: "",
    equipment: "",
    workDone: "",
    issues: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Daily Progress Report:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Daily Progress Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Date / Weather / Project */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Weather
              </label>

              <select
                name="weather"
                value={form.weather}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select</option>
                <option value="sunny">Sunny</option>
                <option value="PartlyCloudy">Partly Cloudy</option>
                <option value="Rainy">Rainy</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Project
              </label>
              <input
                type="text"
                name="project"
                value={form.project}
                placeholder="PRJ-001"
                onChange={handleChange}
                required
                className="w-full mt-1 bg-white border border-gray-300 rounded-md p-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Manpower / Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Manpower (Total Workers)
              </label>
              <input
                type="number"
                name="manpower"
                value={form.manpower}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Equipment (Active Units)
              </label>
              <select
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select</option>
                <option value="1">1 Unit</option>
                <option value="2">2 Units</option>
                <option value="3">3 Units</option>
                <option value="4">4 Units</option>
              </select>
            </div>
          </div>

          {/* Work Done Today */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Work Done Today
            </label>
            <textarea
              name="workDone"
              value={form.workDone}
              onChange={handleChange}
              placeholder="Describe the work completed today..."
              rows={3}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            ></textarea>
          </div>

          {/* Issues / Delays */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Issues / Delays
            </label>
            <textarea
              name="issues"
              value={form.issues}
              onChange={handleChange}
              placeholder="Report any issues or delays encountered..."
              rows={3}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
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
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#4b0095]"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteDiary;
