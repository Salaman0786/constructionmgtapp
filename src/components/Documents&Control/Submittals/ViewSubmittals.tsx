import { useEffect, useRef, useState } from "react";

import { Download, Eye, Trash2, X } from "lucide-react";

import { useGetSubmittalsByIdQuery } from "../../../features/submittals/api/submittalApi";
import Loader from "../../common/Loader";
interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}
const ViewSubmittals: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);

  const { data: projectDetails, isFetching: isProjectFetching } =
    useGetSubmittalsByIdQuery(projectId!, {
      skip: !isEdit,
    });

  const [showAllFiles, setShowAllFiles] = useState([]);

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    submittalCode: "",
    description: "",
    category: "",
    department: "",
    date: "",
    linkedDrawingId: "",
  });

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;
      setForm({
        projectId: p?.project?.name,
        title: p?.title,
        category: p?.category,
        submittalCode: p?.submittalCode,
        department: p?.department,
        date: p?.date.split("T")[0],
        description: p?.description,
        linkedDrawingId: p?.linkedDrawing?.drawingName,
      });
      setShowAllFiles(p?.files);
    }
  }, [projectDetails, isEdit]);

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="w-full max-w-xl mx-auto bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">View Submittals</h2>
            <div onClick={onClose} className="cursor-pointer text-xl">
              <X />
            </div>
          </div>
          {isProjectFetching ? (
            <Loader />
          ) : (
            <div>
              {/* FORM FIELDS */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Project
                </label>

                <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                  {form?.projectId}
                </div>
              </div>
              <div className="mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.title}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Submittal Number
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.submittalCode}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.category}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.department}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date
                  </label>

                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.date}
                  </div>
                </div>
              </div>

              {form?.linkedDrawingId && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Linked Drawing (Optional)
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form?.linkedDrawingId}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                  {form?.description}
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Uploaded Files
                </label>
              </div>

              {/* FILE LIST */}
              {showAllFiles.length > 0 && (
                <div className="mb-6">
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
                            onClick={() => handleDownload(doc.url)}
                            className="text-gray-700 hover:text-gray-900"
                          >
                            <Download />
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
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubmittals;
