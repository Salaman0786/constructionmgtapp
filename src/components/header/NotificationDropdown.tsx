import { useEffect, useRef, useState } from "react";
import Notifications from "./Notifications";
import { useGetNotificationCountQuery } from "../../features/notifications/api/notificationsApi";
import { useAppSelector } from "../../app/hooks";

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role?.name ?? "";

  const { data } = useGetNotificationCountQuery(undefined);

  const handleClick = (): void => {
    setOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount: number = data?.data?.unread ?? 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleClick}
        className="relative flex items-center justify-center h-8 w-8 rounded-full
          border border-gray-200 bg-white text-gray-500 transition-colors
          hover:bg-gray-100 hover:text-gray-700
          dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400
          dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div
            className="absolute -right-2 -top-2 z-10 flex items-center justify-center
              w-5 h-5 rounded-full bg-red-500 text-white text-xs font-medium"
          >
            {unreadCount}
          </div>
        )}

        {/* Bell Icon */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute mt-3 z-10 max-h-[580px] w-[600px] max-w-[95vw] overflow-y-auto
            ${role === "SUPER_ADMIN" ? "right-[-157px]" : "right-[-185px]"}`}
        >
          <Notifications onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
