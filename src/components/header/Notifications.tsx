import {
  CheckCircle,
  FileText,
  Building2,
  ClipboardList,
  Calendar,
  Settings,
  CheckCheck,
  Check,
} from "lucide-react";
import { useGetNotificationsQuery } from "../../features/notifications/api/notificationsApi";
import { useState } from "react";
import { timeFormat } from "../../utils/timeFormat";

type NotificationType = "procurement" | "vendors" | "projects" | "systems";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "Purchase Request #PR-2024-156 requires your approval",
    description:
      "New purchase request for steel reinforcement bars for Tower B foundation work. Total amount exceeds $50,000 threshold.",
    time: "2h ago",
    type: "procurement",
    read: false,
  },
  {
    id: 2,
    title: "Vendor ABC Construction updated their profile",
    description:
      "Updated insurance documents and safety certifications uploaded. Please review for compliance.",
    time: "2h ago",
    type: "vendors",
    read: true,
  },
  {
    id: 3,
    title: "RFQ #RFQ-2024-089 received 3 new bids",
    description:
      "Bids received from Apex Builders, City Construction, and Metro Materials for the HVAC installation package.",
    time: "2h ago",
    type: "procurement",
    read: false,
  },
  {
    id: 4,
    title: "Project Tower B schedule updated - new deadline",
    description:
      "Foundation phase timeline extended by 5 days due to weather conditions. Critical path updated.",
    time: "2h ago",
    type: "projects",
    read: false,
  },
  {
    id: 5,
    title: "System maintenance scheduled for tonight at 11 PM",
    description:
      "Platform will be unavailable for approximately 30 minutes for scheduled database upgrades.",
    time: "2h ago",
    type: "systems",
    read: false,
  },
];

const typeStyles: Record<
  NotificationType,
  { icon: JSX.Element; badge: string; bg: string }
> = {
  procurement: {
    icon: <ClipboardList className="w-5 h-5 text-orange-500" />,
    badge: "Procurement",
    bg: "bg-orange-100",
  },
  vendors: {
    icon: <Building2 className="w-5 h-5 text-blue-500" />,
    badge: "Vendors",
    bg: "bg-blue-100",
  },
  projects: {
    icon: <Calendar className="w-5 h-5 text-green-500" />,
    badge: "Projects",
    bg: "bg-green-100",
  },
  systems: {
    icon: <Settings className="w-5 h-5 text-red-500" />,
    badge: "Systems",
    bg: "bg-red-100",
  },
};

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery({
    page: page,
    limit: 10,
    type: type,
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#f0f0f0] rounded-xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500">
          System alerts, approvals, and activity updates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-md border text-sm ${
            type === ""
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }   `}
          onClick={() => setType("")}
        >
          All Notifications
        </button>
        <button
          className={`px-4 py-2 rounded-md border text-sm ${
            type === "unread"
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } `}
          onClick={() => setType("unread")}
        >
          Unread
        </button>
        <button
          className={`px-4 py-2 rounded-md border text-sm ${
            type === "read"
              ? "bg-[#4b0082] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          } `}
          onClick={() => setType("read")}
        >
          Read
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {data?.data?.notifications.map((item) => {
          return (
            <div
              key={item?.notification?.id}
              className="flex items-start gap-4 bg-white rounded-lg p-4 border shadow-sm"
            >
              {/* Icon */}
              {/* <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${meta.bg}`}
              >
                {meta.icon}
              </div> */}

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item?.notification?.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item?.notification?.message}
                </p>

                <div className="flex items-center gap-3 mt-2 justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full border text-gray-600">
                    {item?.notification?.type}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-3 mt-2">
                    {timeFormat(item?.notification?.createdAt)}{" "}
                    {item?.isRead ? (
                      <CheckCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <Check className="w-5 h-5 text-gray-300" />
                    )}
                  </span>
                </div>
              </div>

              {/* Read Status */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
