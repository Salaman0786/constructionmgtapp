import React, { useEffect, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { useGetDrawingsByIdQuery } from "../../../features/drawings&controls/api/drawingsApi";
import Loader from "../../common/Loader";
import { formatToYMD } from "../../../utils/helpers";

interface ViewDrawingsProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null;
}

interface DrawingFile {
  id: string;
  originalName: string;
  url: string;
}

interface DrawingDetails {
  drawingName: string;
  discipline: string;
  revision: string;
  description: string;
  date: string;
  project?: {
    name: string;
  };
  files: DrawingFile[];
}

interface DrawingsByIdResponse {
  data: DrawingDetails;
}

const ViewDrawings: React.FC<ViewDrawingsProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const isEdit = Boolean(projectId);

  const { data: projectDetails, isFetching } = useGetDrawingsByIdQuery(
    projectId as string,
    {
      skip: !isEdit,
    },
  ) as {
    data?: DrawingsByIdResponse;
    isFetching: boolean;
  };

  const [showAllFiles, setShowAllFiles] = useState<DrawingFile[]>([]);
  const [form, setForm] = useState({
    projectName: "",
    drawingName: "",
    discipline: "",
    revision: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit && projectDetails?.data) {
      const p = projectDetails.data;

      setForm({
        projectName: p.project?.name ?? "",
        drawingName: p.drawingName,
        discipline: p.discipline,
        revision: p.revision,
        date: p.date.split("T")[0],
        description: p.description,
      });

      setShowAllFiles(p.files ?? []);
    }
  }, [projectDetails, isEdit]);

  const handleDownload = async (fileUrl: string): Promise<void> => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileUrl.split("/").pop() || "download";
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
        <div className="w-full max-w-xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">View Drawing</h2>
            <button onClick={onClose} className="cursor-pointer text-xl">
              <X />
            </button>
          </div>

          {isFetching ? (
            <Loader />
          ) : (
            <div>
              {/* Project */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Project
                </label>
                <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                  {form.projectName}
                </div>
              </div>

              {/* Drawing Name & Discipline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Drawing Name
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form.drawingName}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Discipline
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form.discipline}
                  </div>
                </div>
              </div>

              {/* Revision & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Revision
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {form.revision}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                    {formatToYMD(form.date)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="w-full mt-1 border border-gray-300 rounded-md p-2">
                  {form.description}
                </div>
              </div>

              {/* Files */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Uploaded Files
                </label>
              </div>

              {showAllFiles.length === 0 ? (
                <div className="mb-6 text-center text-gray-500 text-sm">
                  No files uploaded
                </div>
              ) : (
                <div className="space-y-2 bg-gray-50 p-3 rounded-md border text-sm mb-6">
                  {showAllFiles.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-white rounded border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium w-6 text-gray-700 text-center">
                          {index + 1}
                        </span>
                        <div className="truncate">{doc.originalName}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(doc.url, "_blank")}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc.url)}
                          className="p-1 text-gray-700 hover:text-gray-900"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-[#facf6c]"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDrawings;
