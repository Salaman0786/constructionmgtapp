import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";
import NotificationDropdown from "../components/header/NotificationDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] =
    useState<boolean>(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-99 flex h-16 w-full bg-white border-gray-200 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        {/* LEFT SECTION */}
        <div className="flex w-full items-center justify-between gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="flex items-center justify-center w-6 h-6 rounded-lg border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 lg:h-8 lg:w-8"
          >
            {isMobileOpen ? (
              /* Close Icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 011.06-1.06L12 10.94l4.72-4.72a.75.75 0 111.06 1.06L13.06 12l4.72 4.72a.75.75 0 11-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 11-1.06-1.06L10.94 12 6.22 7.28z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.33.25h13.33a.75.75 0 010 1.5H1.33a.75.75 0 010-1.5zm0 5h6.67a.75.75 0 010 1.5H1.33a.75.75 0 010-1.5zm0 5h13.33a.75.75 0 010 1.5H1.33a.75.75 0 010-1.5z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* App Name (Mobile) */}
          <div className="flex text-lg font-semibold text-[#4b0082] sm:hidden">
            Construction Mgt App
          </div>

          {/* Mobile App Menu Toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } w-full items-center justify-end gap-4 border-b border-gray-200 bg-white px-5 py-4 shadow-theme-md lg:flex lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none`}
        >
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
