import { useEffect, useRef, useState } from "react";

import { Calendar, Download, Eye, Trash2, UploadCloud, X } from "lucide-react";
import { showError, showInfo, showSuccess } from "../../../utils/toast";

import {
  useCreateSubmittalsMutation,
  useDeleteSubmittalsFileMutation,
  useGetSubmittalsByIdQuery,
  useGetSubmittalsProjectsDrawingsQuery,
  useGetSubmittalsProjectsQuery,
  useUpdateSubmittalsMutation,
  useUploadSubmittalsMutation,
} from "../../../features/submittals/api/submittalApi";
import Loader from "../../common/Loader";
import { RequiredLabel } from "../../common/RequiredLabel";
import { formatToYMD } from "../../../utils/helpers";
import { validateSubmittals } from "../../../utils/validators/submittalsValidator";
import { getAddisAbabaDate, convertToAddisDate } from "../../../utils/helpers";

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}
const AddModalSubmittal: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false); // visual state while dragging

  //Track Upload Request with a REF
  const uploadRequestRef = useRef<any>(null);

  //DO NOT update state if modal is closed
  const isModalOpenRef = useRef(isOpen);
  useEffect(() => {
    isModalOpenRef.current = isOpen;
  }, [isOpen]);

  const MAX_FILES = 10;
  const MAX_FILE_SIZE_MB = 10; // 10 MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  //searchable project dropdown state
  const [projectSearch, setProjectSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef(null);

  //searchable linked drawing dropdown state
  const [drawingSearch, setDrawingSearch] = useState("");
  const [showDrawingDropdown, setShowDrawingDropdown] = useState(false);
  const [highlightDrawingIndex, setHighlightDrawingIndex] = useState(-1);
  const drawingDropdownRef = useRef(null);

  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch: refetchProjects,
  } = useGetSubmittalsProjectsQuery(undefined);
  const {
    data: projectDetails,
    isFetching: isProjectFetching,
    refetch: newFetch,
  } = useGetSubmittalsByIdQuery(projectId!, {
    skip: !isEdit,
  });
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const {
    data: projectDrawings,
    isFetching: isProjectDrawings,
    refetch: newFetchDrawings,
  } = useGetSubmittalsProjectsDrawingsQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [updateSubmittals, { isLoading: updating }] =
    useUpdateSubmittalsMutation();
  const [showAllFiles, setShowAllFiles] = useState([]);

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    department: "",
    date: "",
    linkedDrawingId: null as string | null,
  });

  // category -> departments mapping (IDs + names). Adjust per backend if needed.
  const DEPARTMENTS_BY_CATEGORY: Record<
    string,
    { id: string; name: string }[]
  > = {
    Drawing: [
      { id: "Architecture", name: "Architecture" },
      { id: "Structural", name: "Structural" },
      { id: "MEP", name: "MEP" },
      { id: "Electrical", name: "Electrical" },
      { id: "Plumbing", name: "Plumbing" },
    ],

    Material: [
      { id: "Civil", name: "Civil" },
      { id: "Electrical", name: "Electrical" },
      { id: "Plumbing", name: "Plumbing" },
      { id: "Finishing", name: "Finishing" },
      { id: "Interior", name: "Interior" },
    ],

    "Vendor/Contractor": [
      { id: "Civil Contractor", name: "Civil Contractor" },
      { id: "MEP Contractor", name: "MEP Contractor" },
      { id: "Electrical Contractor", name: "Electrical Contractor" },
      { id: "Supplier", name: "Supplier" },
      { id: "Sub-Contractor", name: "Sub Contractor" },
    ],

    Finance: [
      { id: "Accounts", name: "Accounts" },
      { id: "Billing", name: "Billing" },
      { id: "Procurement", name: "Procurement" },
      { id: "Cost Control", name: "Cost Control" },
      { id: "Audit", name: "Audit" },
    ],

    HR: [
      { id: "Human Resources", name: "Human Resources" },
      { id: "Admin", name: "Admin" },
      { id: "Site HR", name: "Site HR" },
      { id: "Payroll", name: "Payroll" },
    ],

    General: [
      { id: "Project Management", name: "Project Management" },
      { id: "Site Office", name: "Site Office" },
      { id: "Planning", name: "Planning" },
      { id: "Quality", name: "Quality" },
      { id: "Safety", name: "Safety" },
    ],
  };

  // department options shown in <select>
  const [departmentOptions, setDepartmentOptions] = useState<
    { id: string; name: string }[]
  >([]);

  // When we programmatically populate form from API (edit), skip the category-effect once
  const skipCategoryEffectRef = useRef(false);

  // update department options whenever form.category changes (user action)
  useEffect(() => {
    // If our edit-populate just ran, skip this effect once to avoid clearing department.
    if (skipCategoryEffectRef.current) {
      skipCategoryEffectRef.current = false;
      return;
    }

    const cat = form?.category;
    if (!cat) {
      setDepartmentOptions([]);
      setForm((prev) => ({ ...prev, department: "" }));
      return;
    }

    const options = DEPARTMENTS_BY_CATEGORY[cat] || [];
    setDepartmentOptions(options);
    // Reset selected department because user changed category
    setForm((prev) => ({ ...prev, department: "" }));
  }, [form?.category]);

  const [uploadSubmittals, { isLoading, reset: resetUpload }] =
    useUploadSubmittalsMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createSubmittals, { isLoading: isCreateLoading }] =
    useCreateSubmittalsMutation();

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;

      const loadedCategory = p?.category || "";
      const baseOptions = loadedCategory
        ? DEPARTMENTS_BY_CATEGORY[loadedCategory] || []
        : [];

      // We'll always build a final options array (may include injected fallback)
      let finalOptions = [...baseOptions];
      let departmentIdToSet = "";

      if (p?.department) {
        const apiDept = String(p.department).trim();

        // try 1: api value is already an id
        const byId = finalOptions.find((o) => String(o.id) === apiDept);
        if (byId) {
          departmentIdToSet = byId.id;
        } else {
          // try 2: api value is a display name; find by name (case-insensitive)
          const byName = finalOptions.find(
            (o) => String(o.name).toLowerCase() === apiDept.toLowerCase()
          );
          if (byName) {
            departmentIdToSet = byName.id;
          } else {
            // not found → inject fallback option (use slug id so it's unique & stable)
            const slugId = apiDept.toLowerCase().replace(/\s+/g, "_");
            const extra = { id: slugId, name: apiDept };
            // avoid duplicates
            if (!finalOptions.find((o) => o.id === slugId)) {
              finalOptions = [extra, ...finalOptions];
            }
            departmentIdToSet = slugId;
          }
        }
      }

      // IMPORTANT: set department options first (so select options exist)
      setDepartmentOptions(finalOptions);

      // make category-effect skip once (prevents it clearing department right after we setForm)
      skipCategoryEffectRef.current = true;

      // Set form after options are ready
      setForm({
        projectId: p?.project?.id || "",
        title: p?.title || "",
        category: loadedCategory || "",
        department: departmentIdToSet || "",
        date: convertToAddisDate(p?.date),
        description: p?.description || "",
        linkedDrawingId: p?.linkedDrawingId ?? null,
      });

      // other UI state
      setShowAllFiles(p?.files || []);
      setSelectedProjectId(p?.project?.id || "");
      setProjectSearch(
        p?.project?.code
          ? `${p.project.code} - ${p.project.name}`
          : p?.project?.name || ""
      );
      setDrawingSearch(
        p?.linkedDrawing
          ? `${p?.linkedDrawing?.drawingCode} - ${p?.linkedDrawing?.drawingName}`
          : ""
      );

      // optional debug (remove in production)
      // console.log("EDIT POPULATE", { loadedCategory, finalOptions, apiDept: p?.department, departmentIdToSet });
    }
  }, [projectDetails, isEdit]);

  // Clear Add modal state (form, showAllFiles, selectedProjectId) whenever Add modal opens (especially after closing View).
  useEffect(() => {
    if (isOpen && !isEdit) {
      setForm({
        projectId: "",
        title: "",
        category: "",
        department: "",
        date: "",
        description: "",
        linkedDrawingId: "",
      });
      setShowAllFiles([]);
      setSelectedProjectId(""); // clear drawings API input
      setProjectSearch(""); // clear project UI
      setDrawingSearch(""); // clear drawing UI
      setHighlightIndex(-1); // clear hovered row
      setHighlightDrawingIndex(-1); // clear hovered drawing row
      setDepartmentOptions([]);
    }
  }, [isOpen, isEdit]);

  // Manage automatic filled date while creating
  useEffect(() => {
    //CREATE MODE → set today's date
    if (isOpen && !isEdit) {
      const today = getAddisAbabaDate();

      setForm((prev) => ({
        ...prev,
        date: today,
      }));
    }

    //EDIT MODE → set API date
    if (isEdit && projectDetails?.data?.date) {
      setForm((prev) => ({
        ...prev,
        date: convertToAddisDate(projectDetails?.data?.date),
      }));
    }
  }, [isOpen, isEdit, projectDetails]);

  //close seacable dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      // Project dropdown close
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }

      // Drawing dropdown close
      if (
        drawingDropdownRef.current &&
        !drawingDropdownRef.current.contains(e.target)
      ) {
        setShowDrawingDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // block if upload already running
    if (isLoading) {
      setFileError(
        "Upload in progress. Please wait until current upload finishes."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    //PER-SELECTION LIMIT ONLY (not cumulative)
    if (files.length > MAX_FILES) {
      setFileError(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    } else {
      setFileError("");
    }

    //Separate valid and oversized files
    const oversizedFiles: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    //Show error for large files (BUT DO NOT STOP VALID UPLOAD)
    if (oversizedFiles.length > 0) {
      setFileError(
        `These files exceed ${MAX_FILE_SIZE_MB}MB and were skipped:\n${oversizedFiles
          .map((f) => `• ${f}`)
          .join("\n")}`
      );
    } else {
      setFileError(""); // clear old error if all files are valid
    }

    //If NO valid files left → stop here
    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));

      //Track request for abort
      const uploadPromise = uploadSubmittals(formData);
      uploadRequestRef.current = uploadPromise;

      const res = await uploadPromise.unwrap();

      const uploadedFiles = res?.data?.files || [];

      //Do not update state if modal already closed
      if (!isModalOpenRef.current) return;

      setShowAllFiles((prev) => [...uploadedFiles, ...prev]);
      //Clear file validation once upload happens
      if (errors.files) {
        setErrors((prev) => ({ ...prev, files: "" }));
      }

      showSuccess(
        `${uploadedFiles.length} valid file(s) uploaded successfully!`
      );
    } catch (err: any) {
      showError(err?.data?.message || "Upload failed!");
    } finally {
      resetUpload();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Cleanup effect to safely cancel any ongoing upload request
  // This runs ONLY when the component unmounts (route change, page refresh, parent unmount).
  // It prevents:
  //  Background API calls
  // Delayed success/error toasts
  // Memory leaks
  // Ghost uploads after modal is gone
  // If an upload is currently running, we abort it immediately.
  useEffect(() => {
    return () => {
      if (uploadRequestRef.current?.abort) {
        uploadRequestRef.current.abort();
      }
    };
  }, []);

  //handle select project
  const handleSelectProject = (p) => {
    setForm({ ...form, projectId: p.id });
    setSelectedProjectId(p.id); // load drawings
    setProjectSearch(p.code + " - " + p.name);
    setShowDropdown(false);
    //Clear project error on select
    if (errors.projectId) {
      setErrors((prev) => ({ ...prev, projectId: "" }));
    }
  };

  //handle select linked drawing
  const handleSelectDrawing = (d) => {
    setForm({ ...form, linkedDrawingId: d.id });
    setDrawingSearch(`${d.drawingCode} - ${d.drawingName}`);
    setShowDrawingDropdown(false);
  };

  const [deleteFile, { isLoading: isDeleteLoading }] =
    useDeleteSubmittalsFileMutation();

  const handleDelete = async (fileId) => {
    try {
      setDeletingFileId(fileId);
      await deleteFile(fileId).unwrap();
      setShowAllFiles((prev) => prev.filter((data) => data.id !== fileId));
      showSuccess("File deleted successfully!!");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingFileId(null);
    }
  };
  const handleSubmit = async () => {
    const validationErrors = validateSubmittals(form);
    setErrors(validationErrors);

    // if field validation fails → show info and stop
    if (Object.keys(validationErrors).length > 0) {
      showInfo("Please fill all required fields");
      return;
    }

    //optionally: block submit when file upload in progress
    if (isLoading) {
      setFileError(
        "Upload in progress. Please wait until current upload finishes."
      );
      return;
    }

    const today = getAddisAbabaDate();

    const payload = {
      projectId: form.projectId,
      title: form.title,
      category: form.category,
      department: form.department,
      date: form.date,
      description: form.description,
      files: showAllFiles,
      linkedDrawingId: form.linkedDrawingId || null,
    };

    try {
      if (isEdit) {
        await updateSubmittals({ id: projectId, payload }).unwrap();
        showSuccess("Submittal updated successfully!");
      } else {
        await createSubmittals(payload).unwrap();
        showSuccess("Submittal uploaded successfully!");
      }
      onClose();
      refetch();
      newFetch();
      setShowAllFiles([]);
      setForm({
        projectId: "",
        title: "",
        category: "",
        department: "",
        date: today,
        description: "",
        linkedDrawingId: "",
      });
      setShowAllFiles([]);
      setFileError("");
      setErrors({});
    } catch (error: any) {
      const msg = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message;

      showError(msg);
    } finally {
      setForm({
        projectId: "",
        title: "",
        category: "",
        department: "",
        date: today,
        description: "",
        linkedDrawingId: "",
      });
      setShowAllFiles([]);
      setFileError("");
    }
  };
  if (!isOpen) return null;
  const handleClose = () => {
    // ABORT(upload submittal) API CALL IF RUNNING
    if (uploadRequestRef.current?.abort) {
      uploadRequestRef.current.abort();
      uploadRequestRef.current = null;
    }
    resetUpload(); // clears isLoading state

    const today = getAddisAbabaDate();

    setForm({
      projectId: "",
      title: "",
      category: "",
      department: "",
      date: today,
      description: "",
      linkedDrawingId: "",
    });
    setShowAllFiles([]);
    setSelectedProjectId(""); // clears previous project drawings
    setProjectSearch(""); // FIX
    setDrawingSearch(""); // FIX
    setFileError("");
    setErrors({});
    setDepartmentOptions([]);
    onClose();
  };
  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      // Extract file name from URL
      const filename = fileUrl.split("/").pop() || "download";
      a.download = filename;

      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  //filter projects
  const filteredProjects = projectsData?.data?.projects?.filter((p) =>
    `${p.code} ${p.name}`.toLowerCase().includes(projectSearch.toLowerCase())
  );

  //filter drawing
  const filteredDrawings =
    projectDrawings?.data?.drawings?.filter((d) =>
      `${d.drawingCode} ${d.drawingName}`
        .toLowerCase()
        .includes(drawingSearch.toLowerCase())
    ) || [];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="w-full max-w-xl mx-auto bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update Submittal" : "New Submittal"}
            </h2>
            <div onClick={handleClose} className="cursor-pointer text-xl">
              <X />
            </div>
          </div>
          {isProjectFetching ? (
            <Loader />
          ) : (
            <div>
              {/* FORM FIELDS */}
              {/** project searchable dropdown */}

              <div className="relative mb-4" ref={dropdownRef}>
                <RequiredLabel label="Project" />

                <input
                  type="text"
                  value={projectSearch}
                  placeholder="Search project by code or name..."
                  onChange={(e) => {
                    setProjectSearch(e.target.value.trimStart());
                    setShowDropdown(true);

                    if (errors.projectId) {
                      setErrors((prev) => ({ ...prev, projectId: "" }));
                    }
                  }}
                  onFocus={() => {
                    refetchProjects();
                    setShowDropdown(true);
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />

                {projectSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectSearch("");
                      setForm({ ...form, projectId: "" });
                      setSelectedProjectId(""); // clear drawings
                    }}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {showDropdown && (
                  <div
                    className="absolute w-full bg-white border border-gray-300 rounded-md mt-1
      max-h-56 overflow-y-auto shadow-lg z-50"
                  >
                    {filteredProjects.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}

                    {filteredProjects.map((p, index) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProject(p)}
                        onMouseEnter={() => setHighlightIndex(index)}
                        className={`px-4 py-2 cursor-pointer text-sm
                                                 ${
                                                   highlightIndex === index
                                                     ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2]"
                                                     : "hover:bg-gray-100"
                                                 }
                              `}
                      >
                        <div className="font-medium">{p.code}</div>
                        <div className="text-xs text-gray-500">{p.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.projectId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.projectId}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <RequiredLabel label="Title" />
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  value={form?.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <RequiredLabel label="Category" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  value={form?.category}
                  onChange={(e) => {
                    setForm({ ...form, category: e.target.value });
                    if (errors.category)
                      setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Material">Material</option>
                  <option value="Drawing">Drawing</option>
                  <option value="Finance">Finance</option>
                  <option value="Vendor/Contractor">Vendor Contractor</option>
                  <option value="HR">HR</option>
                  <option value="General">General</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Department" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={form?.department}
                    onChange={(e) => {
                      setForm({ ...form, department: e.target.value });
                      if (errors.department)
                        setErrors((prev) => ({ ...prev, department: "" }));
                    }}
                    disabled={!form.category}
                  >
                    <option value="">
                      {!form.category
                        ? "-- Select category first --"
                        : "Choose department"}
                    </option>

                    {departmentOptions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel label="Created Date" />
                  <div className="relative">
                    <input
                      type="text"
                      name="date"
                      value={form?.date ? formatToYMD(form.date) : ""}
                      disabled={true}
                      className="w-full mt-1 border border-gray-300 bg-gray-100
                        cursor-not-allowed rounded-md p-2 text-sm
                        focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/** linked drawing searchable dropdown */}
              <div className="mb-4 relative" ref={drawingDropdownRef}>
                <label className="text-sm text-gray-700">
                  Linked Drawing
                  <span className=" text-xs text-gray-500 mt-1">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={
                    selectedProjectId
                      ? "Search drawing by code or name..."
                      : "Select project first"
                  }
                  value={drawingSearch}
                  disabled={!selectedProjectId} // disallow search without project
                  onFocus={() =>
                    selectedProjectId && setShowDrawingDropdown(true)
                  }
                  onChange={(e) => {
                    setDrawingSearch(e.target.value.trimStart());
                    setShowDrawingDropdown(true);
                  }}
                />

                {/* Clear Button */}
                {drawingSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawingSearch("");
                      setForm({ ...form, linkedDrawingId: "" });
                    }}
                    className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {/* Dropdown */}
                {showDrawingDropdown && selectedProjectId && (
                  <div
                    className="absolute w-full bg-white border border-gray-300 rounded-md mt-1
      max-h-56 overflow-y-auto shadow-lg z-50"
                  >
                    {/* EMPTY */}
                    {filteredDrawings.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No drawings found
                      </div>
                    )}

                    {/* LIST */}
                    {filteredDrawings.map((d, index) => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectDrawing(d)}
                        onMouseEnter={() => setHighlightDrawingIndex(index)}
                        className={`px-4 py-2 cursor-pointer text-sm ${
                          highlightDrawingIndex === index
                            ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2] font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{d.drawingCode}</div>
                        <div className="text-xs text-gray-500">
                          {d.drawingName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <RequiredLabel label="Description" />
                <textarea
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  placeholder="Write description here..."
                  value={form?.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-6">
                <label className="text-sm text-gray-700">
                  Upload your drawing files
                  <span className=" text-xs text-gray-500 mt-1">
                    {" "}
                    ( Up to 10 files at a time, 10 MB each )
                  </span>
                </label>

                <label
                  className={`mt-2 flex flex-col items-center justify-center w-full border-2 border-dashed
    rounded-xl p-6 cursor-pointer transition-all text-center
    ${
      isDragging
        ? "bg-purple-50 border-purple-400 ring-2 ring-purple-200"
        : "border-purple-300 hover:bg-purple-50"
    }
    ${isLoading ? "pointer-events-none opacity-60" : ""}`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isLoading) setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isLoading) setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setIsDragging(false);

                    if (isLoading) {
                      setFileError(
                        "Upload in progress. Please wait until current upload finishes."
                      );
                      return;
                    }

                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0
                    ) {
                      const input = fileInputRef.current;
                      if (input) {
                        input.files = e.dataTransfer.files;
                        // directly call handler instead of dispatching event for reliability
                        handleFileChange({
                          target: input,
                        } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }
                  }}
                >
                  <UploadCloud size={36} className="text-purple-600 mb-2" />

                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop your drawing here
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    or click to browse
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading} // optional: disable native input
                  />
                </label>
                {fileError && (
                  <pre className="text-red-500 text-xs mt-2 font-medium whitespace-pre-wrap">
                    {fileError}
                  </pre>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                  <p className="flex items-center gap-2 text-sm mt-3 text-purple-700 font-medium">
                    <svg
                      className="animate-spin h-4 w-4 text-purple-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Uploading...
                  </p>
                )}
              </div>

              {/* FILE LIST */}
              {showAllFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Previous Documents
                  </h3>

                  <div className="space-y-2 bg-gray-50 p-3 rounded-md border text-sm">
                    {showAllFiles.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        {/* left: index + filename (shrinkable) */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium w-6 text-gray-700 text-center">
                            {index + 1}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm text-gray-800 truncate"
                              title={doc.originalName}
                            >
                              {doc.originalName}
                            </div>
                          </div>
                        </div>

                        {/* right: actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="p-1 rounded text-blue-400 hover:text-blue-600"
                            aria-label={`View ${doc.originalName}`}
                          >
                            <Eye size={20} />
                          </button>

                          <button
                            // href={doc.url}
                            // download
                            // target="_blank"
                            onClick={() => handleDownload(doc.url)}
                            className="p-1 rounded text-gray-700 hover:text-gray-900"
                            aria-label={`Download ${doc.originalName}`}
                          >
                            <Download size={20} />
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={isDeleteLoading}
                            className="p-1 rounded text-red-600 hover:text-red-800"
                            aria-label={`Delete ${doc.originalName}`}
                          >
                            {deletingFileId === doc.id ? (
                              <svg
                                className="animate-spin h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  className="opacity-25"
                                />
                                <path
                                  fill="currentColor"
                                  className="opacity-75"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                            ) : (
                              <Trash2 size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700
              hover:bg-[#facf6c] hover:border-[#fe9a00]"
                  onClick={handleClose}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md text-sm"
                  // disabled={isCreateLoading}
                  disabled={isCreateLoading || isLoading || updating}
                >
                  {/* {isCreateLoading ? "Saving..." : "Upload Drawing"} */}
                  {
                    isLoading
                      ? "Uploading..." // uploading files (both add & edit)
                      : updating
                      ? "Updating..." // updating drawing (edit mode)
                      : isEdit
                      ? "Update Submittal" // edit mode normal
                      : isCreateLoading
                      ? "Saving..." // create mode saving
                      : "Upload Submittal" // create mode normal
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddModalSubmittal;
