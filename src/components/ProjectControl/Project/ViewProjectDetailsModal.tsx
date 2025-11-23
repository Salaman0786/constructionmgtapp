import React from "react";
import { X } from "lucide-react";
import { useGetProjectByIdQuery } from "../../../features/projectControll/projectsApi";
import { StatusBadge } from "./StatusBadge";

interface ViewProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

const ViewProjectDetailsModal: React.FC<ViewProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const { data, isLoading, isFetching } = useGetProjectByIdQuery(projectId!, {
    skip: !projectId,
  });

  if (!isOpen) return null;

  const project = data?.data;

  const formatDate = (iso: string) => iso?.split("T")[0] || "—";

  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
      <div
        className="
        bg-white 
        w-full 
        max-w-[380px] 
        sm:max-w-xl 
        md:max-w-2xl 
        rounded-lg 
        shadow-lg 
        p-5 
        sm:p-6 
        max-h-[90vh] 
        overflow-y-auto
      "
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Project Details
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {/* Loading State */}
        {isLoading || isFetching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-[#4b0082]"></div>
          </div>
        ) : (
          project && (
            <div
              className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              gap-y-6 
              gap-x-6 
              mt-6
            "
            >
              {/* Field Component */}
              {[
                ["Project ID", project.code],
                ["Project Name", project.name],
                ["Project Type", project.type],
                ["Country", project.country],
                ["City", project.city],
                ["Start Date", formatDate(project.startDate)],
                ["End Date", formatDate(project.endDate)],
                ["Budget", project.budgetBaseline],
                ["Currency", project.currency],
                ["Created At", formatDate(project.createdAt)],
                ["Address", formatDate(project.address)],
                ["Assigned To", project.manager?.fullName || "—"],
              ].map(([label, value], idx) => (
                <div key={idx}>
                  <p className="text-md text-gray-900 ">{label}</p>
                  <p className="text-sm text-[#3A3A3A]  mt-1">{value}</p>
                </div>
              ))}

              {/* Status */}
              <div>
                <p className=" text-md text-gray-900 ">Status</p>
                <span
                  className={`
                    inline-block 
                    mt-1 
                    py-1 
                    text-xs 
                    rounded-full 
                    font-medium 
                  `}
                >
                  <StatusBadge status={project.status} />
                </span>
              </div>
            </div>
          )
        )}

        {/* Footer */}
        <div className="flex justify-center mt-8 border-t pt-4">
          <button
            onClick={onClose}
            className="
              px-6
              py-[6px]
              rounded-md 
              border 
              text-gray-700 
              hover:bg-[#facf6c] hover:border-[#fe9a00]
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectDetailsModal;
