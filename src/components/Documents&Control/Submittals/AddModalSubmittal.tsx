import { useEffect, useRef, useState } from "react";

import { Calendar, Download, Eye, Trash2, UploadCloud, X } from "lucide-react";
import { showError, showSuccess } from "../../../utils/toast";

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
  const [uploadSubmittals, { isLoading }] = useUploadSubmittalsMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createSubmittals, { isLoading: isCreateLoading }] =
    useCreateSubmittalsMutation();

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;
      setForm({
        projectId: p?.project?.id,
        title: p?.title,
        category: p?.category,
        department: p?.department,
        date: p?.date.split("T")[0],
        description: p?.description,
        linkedDrawingId: p?.linkedDrawingId,
      });
      setShowAllFiles(p?.files);

      //IMPORTANT: Load drawings of this project in edit mode too
      setSelectedProjectId(p?.project?.id);

      // 2️⃣ FIX FOR PROJECT SEARCH TEXT
      setProjectSearch(
        p?.project?.code
          ? `${p.project.code} - ${p.project.name}`
          : p?.project?.name || ""
      );

      // 3️⃣ FIX FOR DRAWING SEARCH TEXT
      setDrawingSearch(
        p?.linkedDrawing
          ? `${p?.linkedDrawing?.drawingCode} - ${p?.linkedDrawing?.drawingName}`
          : ""
      );
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
    }
  }, [isOpen, isEdit]);

  // Manage automatic filled date while creating
  useEffect(() => {
    // ✅ CREATE MODE → set today's date
    if (isOpen && !isEdit) {
      const today = new Date().toISOString().split("T")[0];

      setForm((prev) => ({
        ...prev,
        date: today,
      }));
    }

    // ✅ EDIT MODE → set API date
    if (isEdit && projectDetails?.data?.date) {
      setForm((prev) => ({
        ...prev,
        date: projectDetails?.data?.date.split("T")[0],
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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadSubmittals(file).unwrap();
      setShowAllFiles((prev) => [res?.data, ...prev]);
      showSuccess("File uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      showError(err?.data?.message || "Upload failed!");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  //handle select project
  const handleSelectProject = (p) => {
    setForm({ ...form, projectId: p.id });
    setSelectedProjectId(p.id); // load drawings
    setProjectSearch(p.code + " - " + p.name);
    setShowDropdown(false);
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
      await deleteFile(fileId).unwrap();
      setShowAllFiles((prev) => prev.filter((data) => data.id !== fileId));
      showSuccess("File deleted successfully!!");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const handleSubmit = async () => {
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
        date: "",
        description: "",
        linkedDrawingId: "",
      });
      setShowAllFiles([]);
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
        date: "",
        description: "",
        linkedDrawingId: "",
      });
      setShowAllFiles([]);
    }
  };
  if (!isOpen) return null;
  const handleClose = () => {
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
    setSelectedProjectId(""); // clears previous project drawings
    setProjectSearch(""); // FIX
    setDrawingSearch(""); // FIX

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
              </div>

              {/* <div className="mb-4">
                <RequiredLabel label="Project" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.projectId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setForm({ ...form, projectId: pid });
                    setSelectedProjectId(pid);
                  }}
                >
                  <option value="">Select project</option>
                  {projectsData?.data?.projects.map((p) => (
                    <option value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div> */}
              <div className="mb-4">
                <RequiredLabel label="Title" />
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  value={form?.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <RequiredLabel label="Category" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  value={form?.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Material">Material</option>
                  <option value="Drawing">Drawing</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Department" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    <option value="Structural">Structural</option>
                    <option value="MEP">MEP</option>
                    <option value="Civil">Civil</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div>
                  <RequiredLabel label=" Date" />
                  <div className="relative">
                    {/* <input
                      type="date"
                      className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                      onKeyDown={(e) => {
                        if (e.key === " ") e.preventDefault(); // disable SPACE opening calendar
                      }}
                      value={form?.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />

                    <Calendar
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        input?.showPicker?.(); // same as your logic but moved here
                      }}
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    /> */}
                    <input
                      type="text"
                      name="date"
                      value={formatToYMD(form.date)}
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
                <label className="text-sm font-medium text-gray-700">
                  Linked Drawing (Optional)
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

              {/* <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Linked Drawing (Optional)
                </label>

                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.linkedDrawingId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      linkedDrawingId: e.target.value || null,
                    })
                  }
                >
                  <option value="">Select Drawing</option>
                  {selectedProjectId &&
                    projectDrawings?.data?.drawings?.map((p) => (
                      <option value={p.id}>{p.drawingName}</option>
                    ))}
                </select>
              </div> */}
              <div className="mb-4">
                <RequiredLabel label="Description" />
                <textarea
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  placeholder="Write description here..."
                  value={form?.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* FILE UPLOAD */}
              {/* <div className="mb-6">
                <RequiredLabel label="Upload Your Submittal File" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
                {isLoading && (
                  <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                )}
              </div> */}
              <div className="mb-6">
                <RequiredLabel label="Upload Your Drawing File" />

                <label
                  className="mt-2 flex flex-col items-center justify-center w-full border-2 border-dashed
    border-purple-300 rounded-xl p-6 cursor-pointer
    hover:bg-purple-50 transition-all text-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0
                    ) {
                      const input = fileInputRef.current;
                      if (input) {
                        input.files = e.dataTransfer.files;
                        input.dispatchEvent(
                          new Event("change", { bubbles: true })
                        );
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
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

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
                        <span>
                          <span className="font-medium mr-2">{index + 1}</span>
                          {doc.originalName}
                        </span>

                        <div className="flex items-center gap-3 text-gray-600 ">
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Eye />
                          </button>

                          <button
                            // href={doc.url}
                            // download
                            // target="_blank"
                            onClick={() => handleDownload(doc.url)}
                            className="text-gray-700 hover:text-gray-900"
                          >
                            <Download />
                          </button>

                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={isDeleteLoading}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 />
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
                  disabled={isCreateLoading}
                >
                  {/* {isCreateLoading ? "Saving..." : "Upload Drawing"} */}
                  {isEdit
                    ? updating
                      ? "Updating..."
                      : "Update Submittal"
                    : isCreateLoading
                    ? "Saving..."
                    : "Upload Submittal"}
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
