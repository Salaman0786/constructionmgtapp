import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Download, Eye, Trash2, X } from "lucide-react";
import {
  useCreateDrawingsMutation,
  useDeleteDrawingsFileMutation,
  useGetDrawingsByIdQuery,
  useGetDrawingsProjectsQuery,
  useUpdateDrawingsMutation,
  useUploadDrawingsMutation,
} from "../../../features/drawings&controls/api/drawingsApi";
import { showError, showSuccess } from "../../../utils/toast";
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
  // const isEdit = Boolean(projectId);
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch,
  } = useGetDrawingsProjectsQuery(undefined);
  // const { data: projectDetails, isFetching: isProjectFetching } =
  //   useGetDrawingsByIdQuery(projectId!, {
  //     skip: !isEdit,
  //   });
  // const [updateDrawing, { isLoading: updating }] = useUpdateDrawingsMutation();
  const [showAllFiles, setShowAllFiles] = useState([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const isManager = userRole === "MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const cleanedSearch = managerSearch.trim().toLowerCase();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState();
  const [uploadDrawings, { isLoading }] = useUploadDrawingsMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createDrawing, { isLoading: isCreateLoading }] =
    useCreateDrawingsMutation();
  // useEffect(() => {
  //   if (!isEdit && isOpen) {
  //     setForm({
  //       projectId: "",
  //       drawingName: "",
  //     description: "",
  //     })  discipline: "",
  //       revision: "",
  //       date: "",
  //       ;
  //   }
  // }, [isEdit, isOpen]);

  /* -----------------------------------------
          PREFILL FORM IN EDIT MODE
      ----------------------------------------- */
  // console.log(projectDetails, "projectDetailgot");

  // useEffect(() => {
  //   if (isEdit && projectDetails?.data) {
  //     const p = projectDetails.data;
  //     setForm({
  //       projectId: p?.project?.projectId,
  //       drawingName: p?.drawingName,
  //       discipline: p?.discipline,
  //       revision: p?.revision,
  //       date: p?.date,
  //       description: p?.description,
  //     });
  //   }
  // }, [projectDetails, isEdit]);
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
      setShowAllFiles((prev) => prev.filter((data) => data.uuid !== fileId));
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
      await createDrawing(payload).unwrap();
      showSuccess("Drawing uploaded successfully!");
      onClose();
      refetch();
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
    } catch (err) {
      showError(err?.data?.message || "Failed to upload drawing!");
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
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="w-full max-w-xl mx-auto bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Upload New Drawing</h2>
            <div onClick={handleClose} className="cursor-pointer text-xl">
              <X />
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Project *
            </label>
            <select
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
              // value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project</option>
              {projectsData?.data?.projects.map((p) => (
                <option value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Drawing Name *
              </label>
              <input
                type="text"
                placeholder="Enter Drawing Name"
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                // value={form.drawingName}
                onChange={(e) =>
                  setForm({ ...form, drawingName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Discipline *
              </label>
              <select
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                // value={form.discipline}
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
              <label className="text-sm font-medium text-gray-700">
                Revision *
              </label>
              <select
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                // value={form.revision}
                onChange={(e) => setForm({ ...form, revision: e.target.value })}
              >
                <option value="">Select Revision</option>
                <option value="R1">R1</option>
                <option value="R2">R2</option>
                <option value="R3">R3</option>
                <option value="R4">R4</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                className="w-full mt-1 border border-gray-300 rounded-md p-2 cursor-pointer"
                onClick={(e) => {
                  e.currentTarget.showPicker?.(); // ✔ Allowed user gesture
                }}
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault(); // disable SPACE opening calendar
                }}
                // value={form?.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              className="w-full mt-1 border border-gray-300 rounded-md p-2 h-24"
              placeholder="Write description here..."
              // value={form?.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* FILE UPLOAD */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">
              Upload Your Drawing File *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
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
                    key={doc.uuid}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <span>
                      <span className="font-medium mr-2">{index + 1}</span>
                      {doc.originalName}
                    </span>

                    <div className="flex items-center gap-3 text-gray-600 ">
                      <button
                        onClick={() => window.open(doc.url, "_blank")}
                        className="hover:text-blue-400"
                      >
                        <Eye />
                      </button>

                      <button
                        // href={doc.url}
                        // download
                        // target="_blank"
                        onClick={() => handleDownload(doc.url)}
                        className="hover:text-blue-400"
                      >
                        <Download />
                      </button>

                      <button
                        onClick={() => handleDelete(doc.uuid)}
                        disabled={isDeleteLoading}
                        className="hover:text-blue-400"
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
              className="px-4 py-2 border rounded-md text-sm"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-700 text-white rounded-md text-sm"
              disabled={isCreateLoading}
            >
              {isCreateLoading ? "Saving..." : "Upload Drawing"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDrawings;
