import React, { useState } from "react";
import { X } from "lucide-react";

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUnits: React.FC<AddUnitModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    unitNumber: "",
    type: "",
    floor: "",
    area: "",
    price: "",
    description: "",
    amenities: "",
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
    console.log("New Unit Data:", form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Add New Unit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Create a new residential or commercial unit
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unit Number & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Unit Number *
              </label>
              <input
                type="text"
                name="unitNumber"
                placeholder="A-101"
                value={form.unitNumber}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          {/* Floor, Area, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Floor *
              </label>
              <input
                type="number"
                name="floor"
                placeholder="1"
                value={form.floor}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Area (m²) *
              </label>
              <input
                type="number"
                name="area"
                placeholder="85"
                value={form.area}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="75000"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Unit description and features"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none resize-none"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Amenities
            </label>
            <input
              type="text"
              name="amenities"
              placeholder="Parking, Balcony, Storage (comma separated)"
              value={form.amenities}
              onChange={handleChange}
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
              className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]"
            >
              Create Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnits;
