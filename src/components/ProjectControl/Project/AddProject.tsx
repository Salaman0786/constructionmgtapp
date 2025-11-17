import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Edit } from "lucide-react";
import {
  useCreateProjectMutation,
  useGetProjectManagersQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "../../../features/projectControll/projectsApi";
import { showError, showSuccess } from "../../../utils/toast";
import { useSelector } from "react-redux";

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}

interface ProjectForm {
  code: string; // ✅ Add this
  name: string;
  type: string;
  city: string;
  country: string;
  address: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetBaseline: string | number;
  currency: string;
  managerId: string;
}

const AddEditProjectModal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);

  /* -----------------------------------------
        API HOOKS
  ----------------------------------------- */

  const { data: managerData, isLoading: isManagersLoading } =
    useGetProjectManagersQuery(undefined);

  const { data: projectDetails, isFetching: isProjectFetching } =
    useGetProjectByIdQuery(projectId!, {
      skip: !isEdit,
    });

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();

  const loading = creating || updating;

  /* -----------------------------------------
      DEFAULT FORM VALUES
  ----------------------------------------- */
  const initialForm: ProjectForm = {
    code: "",
    name: "",
    type: "",
    city: "",
    country: "",
    address: "",
    startDate: "",
    endDate: "",
    status: "PLANNING",
    budgetBaseline: "",
    currency: "INR",
    managerId: "",
  };

  const [form, setForm] = useState<ProjectForm>(initialForm);

  /* -----------------------------------------
      MANAGER DROPDOWN STATE
  ----------------------------------------- */
  const managers = managerData?.data?.managers || [];
  const [managerSearch, setManagerSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const isManager = userRole === "MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  console.log(userRole);

  const cleanedSearch = managerSearch.trim().toLowerCase();
  const filteredManagers = managers.filter((m: any) =>
    m.fullName.toLowerCase().includes(cleanedSearch)
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -----------------------------------------
      RESET FORM WHEN ENTERING CREATE MODE
  ----------------------------------------- */
  useEffect(() => {
    if (!isEdit && isOpen) {
      setForm(initialForm);
      setManagerSearch("");
      setHighlightIndex(-1);
    }
  }, [isEdit, isOpen]);

  /* -----------------------------------------
      PREFILL FORM IN EDIT MODE
  ----------------------------------------- */
  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;

      setForm({
        code: p.code,
        name: p.name,
        type: p.type,
        city: p.city,
        country: p.country,
        address: p.address,
        startDate: p.startDate.split("T")[0],
        endDate: p.endDate.split("T")[0],
        status: p.status,
        budgetBaseline: p.budgetBaseline,
        currency: p.currency,
        managerId: p.manager?.id || "",
      });

      setManagerSearch(p.manager?.fullName || "");
      setHighlightIndex(-1);
    }
  }, [projectDetails, isEdit]);

  /* -----------------------------------------
      OUTSIDE CLICK TO CLOSE DROPDOWN
  ----------------------------------------- */
  useEffect(() => {
    const handler = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* -----------------------------------------
      ON INPUT CHANGE
  ----------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -----------------------------------------
      SELECT MANAGER
  ----------------------------------------- */
  const handleSelectManager = (manager: any) => {
    setManagerSearch(manager.fullName);
    setForm({ ...form, managerId: manager.id });
    setShowDropdown(false);
  };

  /* -----------------------------------------
      SUBMIT FORM
  ----------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      budgetBaseline: Number(form.budgetBaseline),
    };

    // ❌ Remove code only during CREATE
    if (!isEdit) {
      delete payload.code;
    }

    try {
      if (isEdit) {
        await updateProject({ id: projectId, payload }).unwrap();
        showSuccess("Project updated successfully!");
      } else {
        
        await createProject(payload).unwrap();
        showSuccess("Project created successfully!");

        // Reset form after create
        setForm(initialForm);
        setManagerSearch("");
      }

      onClose();
    } catch (error: any) {
      const msg = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message;

      showError(
        msg === "managerId must be a UUID"
          ? "Invalid manager selected. Please choose from the list."
          : msg || "Something went wrong."
      );
    }
  };

  /* -----------------------------------------
      UI
  ----------------------------------------- */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* EDIT MODE LOADING SPINNER */}
        {isEdit && isProjectFetching && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-[#4b0082]"></div>
          </div>
        )}

        {/* FORM */}
        {!isProjectFetching && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div
              className={`grid grid-cols-1 ${
                isEdit ? "sm:grid-cols-2 gap-4" : "sm:grid-cols-1"
              }`}
            >
              {/*Project Code*/}
              {isEdit && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Project Code
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    disabled
                    className="w-full mt-1 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-md p-2 text-sm
      focus:outline-none"
                  />
                </div>
              )}

              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Enter project name"
                  onChange={handleChange}
                  required
                  disabled={isManager}
                  className={`w-full mt-1 border border-gray-300 ${
                    isManager ? "cursor-not-allowed bg-gray-100" : ""
                  } rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
                />
              </div>
            </div>

            {/* TYPE + STATUS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  placeholder="Residential / Commercial"
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>

            {/* MANAGER SEARCH */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm font-medium text-gray-700">
                Project Manager
              </label>

              <input
                type="text"
                value={managerSearch}
                placeholder="Search manager..."
                disabled={isManager}
                onChange={(e) => {
                  setManagerSearch(e.target.value.trimStart());
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className={`w-full mt-1 border border-gray-300 ${
                  isManager ? "cursor-not-allowed bg-gray-100" : ""
                } rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
              />

              {managerSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setManagerSearch("");
                    setForm({ ...form, managerId: "" });
                  }}
                  className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700 "
                >
                  ✕
                </button>
              )}

              {showDropdown && (
                <div
                  className="absolute w-full bg-white border border-gray-300 rounded-md mt-1
                max-h-56 overflow-y-auto shadow-lg z-50"
                >
                  {isManagersLoading && (
                    <div className="p-3 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  )}

                  {!isManagersLoading && filteredManagers.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No results found
                    </div>
                  )}

                  {filteredManagers.map((m: any, index: number) => (
                    <div
                      key={m.id}
                      onClick={() => handleSelectManager(m)}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={`px-4 py-2 cursor-pointer text-sm
                      ${
                        highlightIndex === index
                          ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2] font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">{m.fullName}</div>
                      <div className="text-xs text-gray-500">{m.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUDGET + CURRENCY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Budget Baseline
                </label>
                <input
                  type="number"
                  name="budgetBaseline"
                  placeholder="0"
                  value={form.budgetBaseline}
                  onChange={handleChange}
                  disabled={isManager}
                  required
                  className={`w-full mt-1 border border-gray-300 ${
                    isManager ? "cursor-not-allowed bg-gray-100" : ""
                  } rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  name="currency"
                  disabled={isManager}
                  value={form.currency}
                  onChange={handleChange}
                  className={`w-full mt-1 border border-gray-300 ${
                    isManager ? "cursor-not-allowed bg-gray-100" : ""
                  } rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* CITY + COUNTRY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address"
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
         focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
              />
            </div>

            {/* BUTTONS */}
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
                disabled={loading}
                className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]
              disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEdit
                  ? loading
                    ? "Updating..."
                    : "Update Project"
                  : loading
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditProjectModal;
