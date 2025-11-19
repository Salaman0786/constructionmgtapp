import React from "react";
import { X, Sun, CloudRain, CloudSun, Users } from "lucide-react";
import { useGetSiteDiaryByIdQuery } from "../../../features/siteDiary/api/siteDiaryApi";

interface ViewSiteDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryId: string | null;
}

const ViewSiteDiaryModal: React.FC<ViewSiteDiaryModalProps> = ({
  isOpen,
  onClose,
  diaryId,
}) => {
  const { data, isLoading, isFetching } = useGetSiteDiaryByIdQuery(diaryId!, {
    skip: !diaryId,
  });

  if (!isOpen) return null;

  const diary = data?.data;

  const formatDate = (iso?: string) => (iso ? iso.split("T")[0] : "—");

  const getWeatherBadge = (weather: string) => {
    switch (weather) {
      case "SUNNY":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs inline-flex items-center gap-1">
            <Sun size={14} /> SUNNY
          </span>
        );
      case "RAINY":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs inline-flex items-center gap-1">
            <CloudRain size={14} /> RAINY
          </span>
        );
      case "PARTLY_CLOUDY":
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs inline-flex items-center gap-1">
            <CloudSun size={14} /> PARTLY_CLOUDY
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
            —
          </span>
        );
    }
  };

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
            Site Diary Details
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
              <p className="text-sm text-gray-800">Date</p>
              <p className="text-sm text-gray-900 mt-1">
                {formatDate(diary.date)}
              </p>
            </div>

            {/* Weather */}
            <div>
              <p className="text-sm text-gray-800">Weather</p>
              <div className="mt-1">{getWeatherBadge(diary.weather)}</div>
            </div>

            {/* Project */}
            <div>
              <p className="text-sm text-gray-800">Project</p>
              <p className="text-sm text-gray-900 mt-1">
                {diary.project?.name || "—"}
              </p>
            </div>

            {/* Manpower */}
            <div>
              <p className="text-sm text-gray-800">Manpower</p>
              <p className="text-sm text-gray-900 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}
                >
                  <Users size={14} /> {diary.manpower}
                </span>
              </p>
            </div>

            {/* Equipment */}
            <div>
              <p className="text-sm text-gray-800">Equipment</p>
              <p className="text-sm text-gray-900 mt-1">{diary.equipment}</p>
            </div>

            {/* Created At */}
            <div>
              <p className="text-sm text-gray-800">Created At</p>
              <p className="text-sm text-gray-900 mt-1">
                {formatDate(diary.createdAt)}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <p className="text-sm text-gray-800">Updated At</p>
              <p className="text-sm text-gray-900 mt-1">
                {formatDate(diary.updatedAt)}
              </p>
            </div>

            {/* Work Done */}
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-800">Work Done</p>
              <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                {diary.workDone || "—"}
              </p>
            </div>

            {/* Issues */}
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-800">Issues</p>
              <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                {diary.issues || "—"}
              </p>
            </div>

            {/* Reported By */}
            <div>
              <p className="text-sm text-gray-800">Reported By</p>
              <p className="text-sm text-gray-900 mt-1">
                {diary.reportedByUser?.fullName || "—"}
              </p>
            </div>
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

export default ViewSiteDiaryModal;
