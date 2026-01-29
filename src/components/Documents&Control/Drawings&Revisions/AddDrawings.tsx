import { useEffect, useRef, useState } from "react";

import { Download, Eye, Trash2, UploadCloud, X } from "lucide-react";
import {
  useCreateDrawingsMutation,
  useDeleteDrawingsFileMutation,
  useGetDrawingsByIdQuery,
  useGetDrawingsProjectsQuery,
  useUpdateDrawingsMutation,
  useUploadDrawingsMutation,
} from "../../../features/drawings&controls/api/drawingsApi";
import { showError, showInfo, showSuccess } from "../../../utils/toast";
import Loader from "../../common/Loader";
import { RequiredLabel } from "../../common/RequiredLabel";
import { formatToYMD } from "../../../utils/helpers";
import { validateDrawings } from "../../../utils/validators/drawingsValidator";
import { getAddisAbabaDate, convertToAddisDate } from "../../../utils/helpers";

interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null;
}

interface DrawingForm {
  projectId: string;
  drawingName: string;
  description: string;
  discipline: string;
  revision: string;
  date: string;
}

interface Project {
  id: string;
  name: string;
  code?: string;
}

interface DrawingFile {
  id: string;
  originalName: string;
  url: string;
}
const AddDrawings: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);
  const [fileError, setFileError] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const uploadRequestRef = useRef<{ abort?: () => void } | null>(null);
  const isModalOpenRef = useRef<boolean>(isOpen);
  useEffect(() => {
    isModalOpenRef.current = isOpen;
  }, [isOpen]);
  const projectDropdownRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [projectSearch, setProjectSearch] = useState<string>("");
  const [showProjectDropdown, setShowProjectDropdown] =
    useState<boolean>(false);
  const [highlightProjectIndex, setHighlightProjectIndex] =
    useState<number>(-1);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllFiles, setShowAllFiles] = useState<DrawingFile[]>([]);

  const MAX_FILES = 10;
  const MAX_TOTAL_FILES = 50;
  const MAX_FILE_SIZE_MB = 10; // 10 MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [updateDrawing, { isLoading: updating }] = useUpdateDrawingsMutation();
  const [form, setForm] = useState<DrawingForm>({
    projectId: "",
    drawingName: "",
    description: "",
    discipline: "",
    revision: "",
    date: "",
  });
  const [uploadDrawings, { isLoading, reset: resetUpload }] =
    useUploadDrawingsMutation();

  const [createDrawing, { isLoading: isCreateLoading }] =
    useCreateDrawingsMutation();
  const { data: projectsData, refetch: refetchProjects } =
    useGetDrawingsProjectsQuery(undefined);

  const { data: projectDetails, isFetching: isProjectFetching } =
    useGetDrawingsByIdQuery(projectId!, { skip: !isEdit });
  useEffect(() => {
    if (isOpen && !isEdit) {
      const today = getAddisAbabaDate();
      setForm((prev) => ({
        ...prev,
        date: today,
      }));
    }

    if (isEdit && projectDetails?.data?.date) {
      setForm((prev) => ({
        ...prev,
        date: convertToAddisDate(projectDetails?.data?.date),
      }));
    }
  }, [isOpen, isEdit, projectDetails]);
  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;
      setForm({
        projectId: p?.project?.id,
        drawingName: p?.drawingName,
        discipline: p?.discipline,
        revision: p?.revision,
        date: convertToAddisDate(p?.date),
        description: p?.description,
      });
      setShowAllFiles(p?.files);
      //THIS WAS MISSING → FIXES PROJECT NAME SHOWING IN EDIT MODE
      setProjectSearch(
        p?.project?.code
          ? `${p.project.code} - ${p.project.name}`
          : p.project.name,
      );
    }
  }, [projectDetails, isEdit]);

  // Reset state when opening ADD modal (not edit)
  useEffect(() => {
    if (isOpen && !isEdit) {
      const today = getAddisAbabaDate();
      setForm({
        projectId: "",
        drawingName: "",
        discipline: "",
        revision: "",
        date: today,
        description: "",
      });

      setShowAllFiles([]);
      setProjectSearch("");
      setShowProjectDropdown(false);
      setHighlightProjectIndex(-1);
    }
  }, [isOpen, isEdit]);

  //to close searchable dropdown
  useEffect(() => {
    function handleClick(e) {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(e.target)
      ) {
        setShowProjectDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // block if upload already running
    if (isLoading) {
      setFileError(
        "Upload in progress. Please wait until current upload finishes.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const existingCount = showAllFiles.length;
    const incomingCount = files.length;

    // 🚫 TOTAL FILE LIMIT CHECK (100)
    if (existingCount + incomingCount > MAX_TOTAL_FILES) {
      setFileError(
        `You can upload a maximum of ${MAX_TOTAL_FILES} files in total.
Currently uploaded: ${existingCount}`,
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // ✅ PER-SELECTION LIMIT ONLY (not cumulative)
    if (files.length > MAX_FILES) {
      setFileError(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    } else {
      setFileError("");
    }

    // ✅ Separate valid and oversized files
    const oversizedFiles: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    // ✅ Show error for large files (BUT DO NOT STOP VALID UPLOAD)
    if (oversizedFiles.length > 0) {
      setFileError(
        `These files exceed ${MAX_FILE_SIZE_MB}MB and were skipped:\n${oversizedFiles
          .map((f) => `• ${f}`)
          .join("\n")}`,
      );
    } else {
      setFileError(""); // clear old error if all files are valid
    }

    // ❌ If NO valid files left → stop here
    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));

      // ✅ Track request for abort
      const uploadPromise = uploadDrawings(formData);
      uploadRequestRef.current = uploadPromise;

      const res = await uploadPromise.unwrap();

      const uploadedFiles = res?.data?.files || [];

      // ✅ Do not update state if modal already closed
      if (!isModalOpenRef.current) return;

      setShowAllFiles((prev) => [...uploadedFiles, ...prev]);

      // ✅ Clear file validation once upload happens
      if (errors.files) {
        setErrors((prev) => ({ ...prev, files: "" }));
      }

      showSuccess(
        `${uploadedFiles.length} valid file(s) uploaded successfully!`,
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

  useEffect(() => {
    return () => {
      if (uploadRequestRef.current?.abort) {
        uploadRequestRef.current.abort();
      }
    };
  }, []);

  const handleSelectProject = (p) => {
    setForm({ ...form, projectId: p.id });

    // Show text in input
    setProjectSearch(p.code ? `${p.code} - ${p.name}` : p.name);

    setShowProjectDropdown(false);
    // ✅ Clear project error on select
    if (errors.projectId) {
      setErrors((prev) => ({ ...prev, projectId: "" }));
    }
  };

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      // Automatically extract filename from URL
      link.download = url.split("/").pop() || "downloaded-file";

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  const [deleteFile, { isLoading: isDeleteLoading }] =
    useDeleteDrawingsFileMutation();

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
    //Run validation
    const validationErrors = validateDrawings(form, showAllFiles);
    setErrors(validationErrors);

    // Stop if validation fails
    if (Object.keys(validationErrors).length > 0) {
      showInfo("Please fill all required fields");
      return;
    }

    const payload = {
      projectId: form.projectId,
      drawingName: form.drawingName,
      discipline: form.discipline,
      revision: form.revision,
      date: form.date,
      description: form.description,
      files: showAllFiles,
    };

    try {
      if (isEdit) {
        await updateDrawing({ id: projectId, payload }).unwrap();
        showSuccess("Drawing updated successfully!");
      } else {
        await createDrawing(payload).unwrap();
        showSuccess("Drawing uploaded successfully!");
      }

      onClose();
      setShowAllFiles([]);
      setForm({
        projectId: "",
        drawingName: "",
        discipline: "",
        revision: "",
        date: getAddisAbabaDate(),
        description: "",
      });
      setShowAllFiles([]);
      setProjectSearch("");
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
        drawingName: "",
        discipline: "",
        revision: "",
        date: getAddisAbabaDate(),
        description: "",
      });
      setShowAllFiles([]);
      setProjectSearch("");
      setFileError("");
    }
  };
  if (!isOpen) return null;
  const handleClose = () => {
    // ABORT(upload drawing) API CALL IF RUNNING
    if (uploadRequestRef.current?.abort) {
      uploadRequestRef.current.abort();
      uploadRequestRef.current = null;
    }
    resetUpload(); // clears isLoading state

    const today = getAddisAbabaDate();
    setFileError("");

    setForm({
      projectId: "",
      drawingName: "",
      discipline: "",
      revision: "",
      date: today,
      description: "",
    });
    setShowAllFiles([]);
    setProjectSearch("");
    setFileError("");
    setErrors({});
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
  const filteredProjects: Project[] =
    projectsData?.data?.projects?.filter((p: Project) =>
      `${p.code ?? ""} ${p.name}`
        .toLowerCase()
        .includes(projectSearch.toLowerCase()),
    ) || [];
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="w-full max-w-xl mx-auto bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update Drawing" : "Upload New Drawing"}
            </h2>
            <div onClick={handleClose} className="cursor-pointer text-xl">
              <X />
            </div>
          </div>

          {isProjectFetching ? (
            <Loader />
          ) : (
            <div>
              {/** searchable project dropdown */}

              <div className="relative mb-4" ref={projectDropdownRef}>
                <RequiredLabel label="Project" />

                <input
                  type="text"
                  value={projectSearch}
                  title={projectSearch}
                  placeholder="Search project by name or code..."
                  onFocus={() => {
                    refetchProjects();
                    setShowProjectDropdown(true);
                  }}
                  onChange={(e) => {
                    setProjectSearch(e.target.value.trimStart());
                    setShowProjectDropdown(true);

                    if (errors.projectId) {
                      setErrors((prev) => ({ ...prev, projectId: "" }));
                    }
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />

                {/* CLEAR BUTTON */}
                {projectSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectSearch("");
                      setForm({ ...form, projectId: "" });
                    }}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {/* DROPDOWN */}
                {showProjectDropdown && (
                  <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg z-50">
                    {/* EMPTY */}
                    {filteredProjects.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}

                    {/* LIST */}
                    {filteredProjects.map((p, index) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProject(p)}
                        onMouseEnter={() => setHighlightProjectIndex(index)}
                        className={`px-4 py-2 cursor-pointer text-sm ${
                          highlightProjectIndex === index
                            ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2]"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{p.code || "—"}</div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Drawing Name" />
                  <input
                    type="text"
                    placeholder="Enter Drawing Name"
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.drawingName}
                    onChange={(e) => {
                      setForm({ ...form, drawingName: e.target.value });
                      if (errors.drawingName) {
                        setErrors((prev) => ({ ...prev, drawingName: "" }));
                      }
                    }}
                  />

                  {errors.drawingName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.drawingName}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel label=" Discipline" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.discipline}
                    onChange={(e) => {
                      setForm({ ...form, discipline: e.target.value });
                      if (errors.discipline) {
                        setErrors((prev) => ({ ...prev, discipline: "" }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Select Discipline
                    </option>
                    <option value="Civil">Civil</option>
                    <option value="Structural">Structural</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Fire Protection">Fire Protection</option>
                    <option value="Water Supply & Sanitation">
                      Water Supply & Sanitation
                    </option>
                    <option value="Roads & Transportation">
                      Roads & Transportation
                    </option>
                    <option value="Telecommunications">
                      Telecommunications
                    </option>
                    <option value="Surveying">Surveying</option>
                  </select>
                  {errors.discipline && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.discipline}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Revision" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.revision}
                    onChange={(e) => {
                      setForm({ ...form, revision: e.target.value });
                      if (errors.revision) {
                        setErrors((prev) => ({ ...prev, revision: "" }));
                      }
                    }}
                  >
                    <option value="" disabled hidden>
                      Select Revision
                    </option>
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                    <option value="R3">R3</option>
                    <option value="R4">R4</option>
                  </select>
                  {errors.revision && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.revision}
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

              <div className="mb-4">
                <RequiredLabel label="Description" />
                <textarea
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  placeholder="Write description here..."
                  value={form?.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }
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
                  Upload files
                  <span className=" text-xs text-gray-500 mt-1">
                    {" "}
                    ( Up to 10 files at a time, 10 MB each, maximum 50 files
                    total )
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
                        "Upload in progress. Please wait until current upload finishes.",
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
                    or click to browse (JPG, PNG, PDF, DOCX…)
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
                          ? "Update Drawing" // edit mode normal
                          : isCreateLoading
                            ? "Saving..." // create mode saving
                            : "Upload Drawing" // create mode normal
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

export default AddDrawings;
