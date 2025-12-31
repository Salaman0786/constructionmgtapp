import {
  CheckCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useNotificationsMarkReadMutation,
} from "../../features/notifications/api/notificationsApi";
import { useEffect, useRef, useState } from "react";
import { timeFormat } from "../../utils/timeFormat";
import { formatLabel } from "../../utils/helpers";
import { useNavigate } from "react-router";
export default function Notifications({ onClose }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const limit = 10;
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotificationsQuery({
    page: page,
    limit: 10,
    type: type,
  });
  const [addNotification] = useNotificationsMarkReadMutation();
  const notificationRoutes: Record<string, string> = {
    DRAWING_REVISION: "/drawings-revisions",
    SUBMITTAL: "/submittals",
  };
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;
  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleRowClick = async (id: any) => {
    const payload = {
      recipientId: id?.recipientId,
    };
    if (!id?.isRead) await addNotification(payload).unwrap();
    const route = notificationRoutes[id?.notification?.entityType];
    if (route) navigate(route);
    onClose();
  };

  return (
    <div
      ref={scrollRef}
      className="
    max-w-5xl mx-auto p-6
    bg-black/10 backdrop-blur-md
    rounded-xl shadow-3xl
    border border-white/10
    max-h-[80vh] overflow-y-auto
  "
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-sm text-black">
          System alerts, approvals, and activity updates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            type === ""
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }   `}
          onClick={() => {
            setType("");
            setPage(1);
          }}
        >
          All Notifications
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            type === "unread"
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } `}
          onClick={() => {
            setType("unread");
            setPage(1);
          }}
        >
          Unread
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm ${
            type === "read"
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } `}
          onClick={() => {
            setType("read");
            setPage(1);
          }}
        >
          Read
        </button>
      </div>
      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-3 text-gray-500">
          Loading notifications...
        </div>
      ) : data?.data?.notifications?.length > 0 ? (
        /* Notification List */
        <div className="space-y-4">
          {data.data.notifications.map((item: any) => (
            <div
              key={item.notification.id}
              className={`flex items-start gap-4 ${
                item.isRead ? "bg-white" : "bg-gray-300"
              } rounded-lg p-4 shadow-sm cursor-pointer overflow-hidden transition-all duration-300`}
              onClick={() => handleRowClick(item)}
            >
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.notification.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {item.notification.message}
                </p>

                <div className="flex items-center gap-3 mt-2 justify-between">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border text-gray-600 ${
                      item.isRead ? "border-gray-300" : "border-gray-400"
                    }`}
                  >
                    {formatLabel(item.notification.type)}
                  </span>

                  <span className="text-xs text-gray-400 flex items-center gap-3">
                    {timeFormat(item.notification.createdAt)}
                    {item.isRead ? (
                      <CheckCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <Check className="w-5 h-5 text-gray-400" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-gray-500 font-medium flex justify-center items-center py-3">
          There are no such notifications.
        </div>
      )}
      {!isLoading && data?.data?.notifications?.length > 0 && (
        <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Showing text */}
          <span className="text-sm sm:text-base">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalItems)} of {totalItems} results
          </span>

          {/* Buttons */}
          <div>
            <div className="flex items-center space-x-2">
              {/* First Page */}
              <button
                onClick={goToFirst}
                disabled={page === 1}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
              text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft size={18} />
              </button>

              {/* Prev */}
              <button
                onClick={goToPrev}
                disabled={page === 1}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
              text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="px-2 text-sm font-medium">
                Page {page} of {totalPages}
              </div>

              {/* Next */}
              <button
                onClick={goToNext}
                disabled={page === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
              text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>

              {/* Last Page */}
              <button
                onClick={goToLast}
                disabled={page === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
              text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
