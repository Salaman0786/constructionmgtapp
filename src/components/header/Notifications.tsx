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

interface NotificationsProps {
  onClose: () => void;
}

interface NotificationEntity {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType: string;
  createdAt: string;
}

interface NotificationItem {
  recipientId: string;
  isRead: boolean;
  notification: NotificationEntity;
}

interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface NotificationsResponse {
  data: {
    notifications: NotificationItem[];
  };
  pagination: Pagination;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [page, setPage] = useState<number>(1);
  const [type, setType] = useState<string>("");

  const limit = 10;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  /* Scroll to top on page change */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const { data, isLoading } = useGetNotificationsQuery({
    page,
    limit,
    type,
  }) as {
    data?: NotificationsResponse;
    isLoading: boolean;
  };

  const [markAsRead] = useNotificationsMarkReadMutation();

  const notificationRoutes: Record<string, string> = {
    DRAWING_REVISION: "/drawings-revisions",
    SUBMITTAL: "/submittals",
  };

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;

  /* Pagination helpers */
  const goToFirst = (): void => setPage(1);
  const goToLast = (): void => setPage(totalPages);
  const goToPrev = (): void => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = (): void =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  const handleRowClick = async (item: NotificationItem): Promise<void> => {
    try {
      if (!item.isRead) {
        await markAsRead({
          recipientId: item.recipientId,
        }).unwrap();
      }

      const route = notificationRoutes[item.notification.entityType];
      if (route) navigate(route);

      onClose();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="max-w-5xl mx-auto p-6 bg-black/10 backdrop-blur-md
      rounded-xl shadow-3xl border border-white/10
      max-h-[80vh] overflow-y-auto"
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
        {[
          { label: "All Notifications", value: "" },
          { label: "Unread", value: "unread" },
          { label: "Read", value: "read" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setType(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm ${
              type === tab.value
                ? "bg-[#4b0082] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-3 text-gray-500">
          Loading notifications...
        </div>
      ) : data?.data?.notifications?.length ? (
        <div className="space-y-4">
          {data.data.notifications.map((item) => (
            <div
              key={item.notification.id}
              onClick={() => handleRowClick(item)}
              className={`flex items-start gap-4 rounded-lg p-4 shadow-sm cursor-pointer
              transition-all duration-300 ${
                item.isRead ? "bg-white" : "bg-gray-300"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.notification.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {item.notification.message}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      item.isRead ? "border-gray-300" : "border-gray-400"
                    }`}
                  >
                    {formatLabel(item.notification.type)}
                  </span>

                  <span className="text-xs text-gray-400 flex items-center gap-2">
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
        <div className="text-gray-500 font-medium flex justify-center py-3">
          There are no such notifications.
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="px-4 pt-3 flex flex-col gap-3 md:flex-row md:justify-between">
          <span className="text-sm">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalItems)} of {totalItems}
          </span>

          <div className="flex items-center space-x-2">
            <button onClick={goToFirst} disabled={page === 1}>
              <ChevronsLeft size={18} />
            </button>
            <button onClick={goToPrev} disabled={page === 1}>
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>

            <button onClick={goToNext} disabled={page === totalPages}>
              <ChevronRight size={18} />
            </button>
            <button onClick={goToLast} disabled={page === totalPages}>
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
