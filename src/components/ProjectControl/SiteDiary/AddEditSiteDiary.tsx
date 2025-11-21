// components/siteDiary/AddEditSiteDiary.tsx
import React, { useEffect, useRef, useState } from "react";
import { X, Calendar, Sun, CloudRain, CloudSun } from "lucide-react";
import {
  useCreateSiteDiaryMutation,
  useGetSiteDiaryByIdQuery,
  useGetSiteDiaryProjectsQuery,
  useUpdateSiteDiaryMutation,
} from "../../../features/siteDiary/api/siteDiaryApi";
import { showError, showInfo, showSuccess } from "../../../utils/toast";
import { useSelector } from "react-redux";
import { validateSiteDiary } from "../../../utils/validators/siteDiaryValidator";
import { RequiredLabel } from "../../common/RequiredLabel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diaryId?: string | null; // if present -> edit mode
}

const WEATHER_OPTIONS = [
  { value: "SUNNY", label: "Sunny", icon: <Sun size={14} /> },
  { value: "RAINY", label: "Rainy", icon: <CloudRain size={14} /> },
  {
    value: "PARTLY_CLOUDY",
    label: "Partly Cloudy",
    icon: <CloudSun size={14} />,
  },
];

const AddEditSiteDiary: React.FC<Props> = ({ isOpen, onClose, diaryId }) => {
  const isEdit = Boolean(diaryId);
  const { data: projectsData } = useGetSiteDiaryProjectsQuery();
  const { data: diaryData, isFetching } = useGetSiteDiaryByIdQuery(diaryId!, {
    skip: !isEdit,
  });
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const isManager = userRole === "MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const [createDiary, { isLoading: creating }] = useCreateSiteDiaryMutation();
  const [updateDiary, { isLoading: updating }] = useUpdateSiteDiaryMutation();
  const loading = creating || updating;
  const [errors, setErrors] = useState<any>({});

  const initialForm = {
    date: "",
    weather: "SUNNY",
    projectId: "",
    manpower: "",
    equipment: "",
    workDone: "",
    issues: "",
  };

  const [form, setForm] = useState(initialForm);
  const [projectSearch, setProjectSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const projects = projectsData?.data?.projects || [];

  useEffect(() => {
    if (!isEdit && isOpen) {
      setForm(initialForm);
      setProjectSearch("");
    }
  }, [isEdit, isOpen]);

  useEffect(() => {
    if (!isEdit || !diaryData) return;

    const diary = diaryData.data; // IMPORTANT: Actual diary object

    if (!diary) return;

    // Prefill form
    setForm({
      date: diary.date?.split("T")[0] || "",
      weather: diary.weather?.toUpperCase() || "SUNNY",
      projectId: diary.projectId || "",
      manpower: String(diary.manpower ?? ""),
      equipment: String(diary.equipment ?? ""),
      workDone: diary.workDone || "",
      issues: diary.issues || "",
    });

    // Prefill project dropdown visible text
    if (diary.project) {
      setProjectSearch(`${diary.project.name}`);
    } else {
      // fallback: find in list
      const proj = projects.find((p) => p.id === diary.projectId);
      if (proj) setProjectSearch(`${proj.code} — ${proj.name}`);
    }
  }, [diaryData, isEdit, projects]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProjects = projects.filter((p) =>
    `${p.code} ${p.name}`
      .toLowerCase()
      .includes(projectSearch.toLowerCase().trim())
  );

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  //   setErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
  // };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectProject = (p: any) => {
    setForm((s) => ({ ...s, projectId: p.id }));
    setProjectSearch(`${p.code} — ${p.name}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ RUN VALIDATION FIRST
    const validationErrors = validateSiteDiary(form);
    setErrors(validationErrors);

    // If any errors exist, stop submission
    if (Object.keys(validationErrors).length > 0) {
      showInfo("Please fill all required fields.");
      return;
    }
    const payload = {
      date: form.date,
      weather: form.weather.toUpperCase(),
      projectId: form.projectId,
      manpower: Number(form.manpower),
      equipment: Number(form.equipment),
      workDone: form.workDone,
      issues: form.issues,
    };

    try {
      if (isEdit && diaryId) {
        await updateDiary({ id: diaryId, payload }).unwrap();
        showSuccess("Site diary updated");
      } else {
        await createDiary(payload).unwrap();
        showSuccess("Site diary created");
        setForm(initialForm);
        setProjectSearch("");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      showError(err?.data?.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[420px] p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit DPR" : "Daily Progress Report"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {isEdit && isFetching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-[#4b0082]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <RequiredLabel label="Date" />
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`w-full mt-1 border border-gray-300  rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              <div>
                <RequiredLabel label="Weather" />
                <select
                  name="weather"
                  value={form.weather}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                >
                  {WEATHER_OPTIONS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
                {errors.weather && (
                  <p className="text-red-500 text-xs mt-1">{errors.weather}</p>
                )}
              </div>
            </div>

            {/* PROJECT SEARCH */}
            <div className="relative" ref={dropdownRef}>
              <RequiredLabel label="Project" />

              <input
                type="text"
                value={projectSearch}
                placeholder="Search project by code or name..."
                onChange={(e) => {
                  setProjectSearch(e.target.value.trimStart());
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className={`w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]`}
              />
              {errors.projectId && (
                <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
              )}

              {/* CLEAR BUTTON */}
              {projectSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setProjectSearch("");
                    setForm({ ...form, projectId: "" });
                  }}
                  className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}

              {/* DROPDOWN */}
              {showDropdown && (
                <div
                  className="absolute w-full bg-white border border-gray-300 rounded-md mt-1
      max-h-56 overflow-y-auto shadow-lg z-50"
                >
                  {/* LOADING STATE (if needed later) */}
                  {false && (
                    <div className="p-3 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  )}

                  {/* EMPTY STATE */}
                  {filteredProjects.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No results found
                    </div>
                  )}

                  {/* RESULT LIST */}
                  {filteredProjects.map((p, index) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProject(p)}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={`px-4 py-2 cursor-pointer text-sm
            ${
              highlightIndex === index
                ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2] font-medium"
                : "hover:bg-gray-100"
            }`}
                    >
                      <div className="font-medium">{p.code}</div>
                      <div className="text-xs text-gray-500">{p.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <RequiredLabel label="Manpower" />
                <input
                  type="number"
                  name="manpower"
                  value={form.manpower}
                  placeholder="0"
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
                {errors.manpower && (
                  <p className="text-red-500 text-xs mt-1">{errors.manpower}</p>
                )}
              </div>
              <div>
                <RequiredLabel label="Equipment" />
                <input
                  type="number"
                  name="equipment"
                  placeholder="0"
                  value={form.equipment}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
                {errors.equipment && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.equipment}
                  </p>
                )}
              </div>
            </div>

            <div>
              <RequiredLabel label="Work Done" />
              <textarea
                name="workDone"
                value={form.workDone}
                onChange={handleChange}
                placeholder="Description the work completed today..."
                rows={3}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
              />
              {errors.workDone && (
                <p className="text-red-500 text-xs mt-1">{errors.workDone}</p>
              )}
            </div>

            <div>
              <RequiredLabel label="Issues" />
              <textarea
                name="issues"
                value={form.issues}
                placeholder="Report any issues or delays encountered..."
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
              />
              {errors.issues && (
                <p className="text-red-500 text-xs mt-1">{errors.issues}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-2">
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
                className="px-4 py-2 bg-[#5b00b2] text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEdit
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                  ? "Creating..."
                  : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditSiteDiary;
