import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, Download, Eye, Trash2, X } from "lucide-react";
import {
  useCreateDrawingsMutation,
  useDeleteDrawingsFileMutation,
  useGetDrawingsByIdQuery,
  useGetDrawingsProjectsQuery,
  useUpdateDrawingsMutation,
  useUploadDrawingsMutation,
} from "../../../features/drawings&controls/api/drawingsApi";
import { showError, showSuccess } from "../../../utils/toast";
import Loader from "../../common/Loader";
import { RequiredLabel } from "../../common/RequiredLabel";
interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}
const AddDrawings: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);

  //project searchable state
  const [projectSearch, setProjectSearch] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [highlightProjectIndex, setHighlightProjectIndex] = useState(-1);
  const projectDropdownRef = useRef(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch,
  } = useGetDrawingsProjectsQuery(undefined);
  const {
    data: projectDetails,
    isFetching: isProjectFetching,
    refetch: newFetch,
  } = useGetDrawingsByIdQuery(projectId!, {
    skip: !isEdit,
  });
  const [updateDrawing, { isLoading: updating }] = useUpdateDrawingsMutation();
  const [showAllFiles, setShowAllFiles] = useState([]);

  const [form, setForm] = useState({
    projectId: "",
    drawingName: "",
    description: "",
    discipline: "",
    revision: "",
    date: "",
  });
  const [uploadDrawings, { isLoading }] = useUploadDrawingsMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createDrawing, { isLoading: isCreateLoading }] =
    useCreateDrawingsMutation();

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;
      setForm({
        projectId: p?.project?.id,
        drawingName: p?.drawingName,
        discipline: p?.discipline,
        revision: p?.revision,
        date: p?.date.split("T")[0],
        description: p?.description,
      });
      setShowAllFiles(p?.files);
      // ⭐ THIS WAS MISSING → FIXES PROJECT NAME SHOWING IN EDIT MODE
      setProjectSearch(
        p?.project?.code
          ? `${p.project.code} - ${p.project.name}`
          : p.project.name
      );
    }
  }, [projectDetails, isEdit]);

  // Reset state when opening ADD modal (not edit)
  useEffect(() => {
    if (isOpen && !isEdit) {
      setForm({
        projectId: "",
        drawingName: "",
        discipline: "",
        revision: "",
        date: "",
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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadDrawings(file).unwrap();
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

  //handle select project in searchable project dropdown
  const handleSelectProject = (p) => {
    setForm({ ...form, projectId: p.id });

    // Show text in input
    setProjectSearch(p.code ? `${p.code} - ${p.name}` : p.name);

    setShowProjectDropdown(false);
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
      refetch();
      newFetch();
      setShowAllFiles([]);
      setForm({
        projectId: "",
        drawingName: "",
        discipline: "",
        revision: "",
        date: "",
        description: "",
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
        drawingName: "",
        discipline: "",
        revision: "",
        date: "",
        description: "",
      });
      setShowAllFiles([]);
      setProjectSearch("");
    }
  };
  if (!isOpen) return null;
  const handleClose = () => {
    setForm({
      projectId: "",
      drawingName: "",
      discipline: "",
      revision: "",
      date: "",
      description: "",
    });
    setShowAllFiles([]);
    setProjectSearch("");
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

  //filter project based on search
  const filteredProjects =
    projectsData?.data?.projects?.filter((p) =>
      `${p.code || ""} ${p.name}`
        .toLowerCase()
        .includes(projectSearch.toLowerCase())
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
                  placeholder="Search project by name or code..."
                  onFocus={() => setShowProjectDropdown(true)}
                  onChange={(e) => {
                    setProjectSearch(e.target.value.trimStart());
                    setShowProjectDropdown(true);
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
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
              </div>

              {/* <div className="mb-4">
                <RequiredLabel label="Project" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                >
                  <option value="">Select project</option>
                  {projectsData?.data?.projects.map((p) => (
                    <option value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Drawing Name" />
                  <input
                    type="text"
                    placeholder="Enter Drawing Name"
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.drawingName}
                    onChange={(e) =>
                      setForm({ ...form, drawingName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <RequiredLabel label=" Discipline" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.discipline}
                    onChange={(e) =>
                      setForm({ ...form, discipline: e.target.value })
                    }
                  >
                    <option value="">Select Discipline</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Structural">Structural</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <RequiredLabel label="Revision" />
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                    value={form?.revision}
                    onChange={(e) =>
                      setForm({ ...form, revision: e.target.value })
                    }
                  >
                    <option value="">Select Revision</option>
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                    <option value="R3">R3</option>
                    <option value="R4">R4</option>
                  </select>
                </div>

                <div>
                  <RequiredLabel label="Date" />
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                      onKeyDown={(e) => {
                        if (e.key === " ") e.preventDefault(); // keep your space-block logic
                      }}
                      value={form?.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />

                    {/* Calendar Icon triggers showPicker() */}
                    <Calendar
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        input?.showPicker?.(); // open picker only when clicking icon
                      }}
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 cursor-pointer"
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-6">
                <RequiredLabel label="Upload Your Drawing File" />
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
                      : "Update Drawing"
                    : isCreateLoading
                    ? "Saving..."
                    : "Upload Drawing"}
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
