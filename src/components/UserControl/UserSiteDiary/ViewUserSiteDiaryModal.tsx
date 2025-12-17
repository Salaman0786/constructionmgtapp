import React from "react";
import { X, Users } from "lucide-react";

import { formatToYMD } from "../../../utils/helpers";
import { renderWeatherBadge } from "../../ProjectControl/SiteDiary/WeatherBadge";
import { useGetUserSiteDiaryByIdQuery } from "../../../features/userSiteDiary/api/userSiteDiaryApi";
import { useSelector } from "react-redux";

interface ViewSiteDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryId: string | null;
}

const ViewUserSiteDiaryModal: React.FC<ViewSiteDiaryModalProps> = ({
  isOpen,
  onClose,
  diaryId,
}) => {
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const { data, isLoading, isFetching } = useGetUserSiteDiaryByIdQuery(
    diaryId!,
    {
      skip: !diaryId,
    }
  );

  if (!isOpen) return null;

  const diary = data?.data?.data;

  const formatDate = (iso?: string) => (iso ? iso.split("T")[0] : "—");

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
            User Site Diary Details
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-[#4b0082]"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isFetching && diary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 mt-6">
            {/* Date */}
            <div>
              <p className="text-md text-gray-900 ">Date</p>
              <p className="text-sm text-[#3A3A3A]  mt-1">
                {formatToYMD(diary.date)}
              </p>
            </div>

            {/* Weather */}
            <div>
              <p className="text-md text-gray-900 ">Weather</p>
              <div className="mt-1">{renderWeatherBadge(diary.weather)}</div>
            </div>

            {/* Project */}
            <div>
              <p className="text-md text-gray-900 ">Project</p>
              <p className="text-sm text-[#3A3A3A]  mt-1">
                {diary.project?.name || "—"}
              </p>
            </div>
            {/* Created At */}
            <div>
              <p className="text-md text-gray-900 ">Created At</p>
              <p className="text-sm text-[#3A3A3A]  mt-1">
                {formatToYMD(diary.createdAt)}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <p className="text-md text-gray-900 ">Updated At</p>
              <p className="text-sm text-[#3A3A3A]  mt-1">
                {formatToYMD(diary.updatedAt)}
              </p>
            </div>

            {/* Work Done */}
            <div className="sm:col-span-2">
              <p className="text-md text-gray-900 ">Work Done</p>
              <p className="text-sm text-[#3A3A3A]  mt-1 whitespace-pre-wrap">
                {diary.workDone || "—"}
              </p>
            </div>

            {/* Issues */}
            <div className="sm:col-span-2">
              <p className="text-md text-gray-900 ">Issues</p>
              <p className="text-sm text-[#3A3A3A]  mt-1 whitespace-pre-wrap">
                {diary.issues || "—"}
              </p>
            </div>

            {/* Reported By */}
            {userRole === "MANAGER" && (
              <div>
                <p className="text-md text-gray-900 ">Reported By</p>
                <p className="text-sm text-gray-900 mt-1">
                  {diary.user?.fullName || "—"}
                </p>
              </div>
            )}
            {userRole === "USER" && (
              <div>
                <p className="text-md text-gray-900 ">Reported To</p>
                <p className="text-sm text-gray-900 mt-1">
                  {diary.reportedTo?.fullName || "—"}
                </p>
              </div>
            )}
          </div>
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

export default ViewUserSiteDiaryModal;
