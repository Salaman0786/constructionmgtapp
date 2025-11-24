import { useEffect, useRef, useState } from "react";

import { Download, Eye, Trash2, X } from "lucide-react";
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
  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch,
  } = useGetSubmittalsProjectsQuery(undefined);
  const {
    data: projectDetails,
    isFetching: isProjectFetching,
    refetch: newFetch,
  } = useGetSubmittalsByIdQuery(projectId!, {
    skip: !isEdit,
  });
  const [submittalId, setSubmittalId] = useState("");
  const {
    data: projectDrawings,
    isFetching: isProjectDrawings,
    refetch: newFetchDrawings,
  } = useGetSubmittalsProjectsDrawingsQuery(submittalId);

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
    linkedDrawingId: "",
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
    }
  }, [projectDetails, isEdit]);
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
      linkedDrawingId: form.linkedDrawingId,
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
              <div className="mb-4">
                <RequiredLabel label="Project" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.projectId}
                  onChange={(e) => {
                    setForm({ ...form, projectId: e.target.value });
                    setSubmittalId(e.target.value);
                    newFetchDrawings();
                  }}
                >
                  <option value="">Select project</option>
                  {projectsData?.data?.projects.map((p) => (
                    <option value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <RequiredLabel label="Title" />
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  value={form?.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <RequiredLabel label="Category" />
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
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
                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
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
                  <input
                    type="date"
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.showPicker?.(); // ✔ Allowed user gesture
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " ") e.preventDefault(); // disable SPACE opening calendar
                    }}
                    value={form?.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Linked Drawing (Optional)
                </label>

                <select
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                  value={form?.linkedDrawingId}
                  onChange={(e) =>
                    setForm({ ...form, linkedDrawingId: e.target.value })
                  }
                >
                  <option value="">Select Drawing</option>
                  {projectDrawings?.data?.drawings?.map((p) => (
                    <option value={p.id}>{p.drawingName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <RequiredLabel label="Description" />
                <textarea
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 h-24"
                  placeholder="Write description here..."
                  value={form?.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-6">
                <RequiredLabel label="Upload Your Submittal File" />
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
                            onClick={() => handleDelete(doc.id)}
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
