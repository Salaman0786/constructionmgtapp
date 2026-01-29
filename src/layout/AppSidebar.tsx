import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Building2,
  UserRoundCog,
  Users,
  FolderOpen,
  Files,
  ChevronDown,
  PlugZap,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAppSelector } from "../app/hooks";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    icon: any;
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    roles?: string[];
  }[];
  roles?: string[];
};

const navItems: NavItem[] = [
  {
    icon: <FolderOpen />,
    name: "Documents & Control",
    roles: ["SUPER_ADMIN", "MANAGER"], // INVESTOR cannot see it
    subItems: [
      {
        icon: <Files />,
        name: "Drawings & Revisions",
        path: "/drawings-revisions",
        pro: false,
        roles: ["SUPER_ADMIN", "MANAGER"],
      },
    ],
  },

  /* ADMIN MODULE → Only SUPER_ADMIN */
  {
    icon: <UserRoundCog />,
    name: "Admin",
    roles: ["SUPER_ADMIN"],
    subItems: [
      {
        icon: <Users />,
        name: "User Management",
        path: "/user-management",
        pro: false,
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PlugZap />,
    name: "Authentication",
    subItems: [
      { icon: <UserRoundCog />, name: "Sign In", path: "/signin", pro: false },
      { icon: <UserRoundCog />, name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role?.name ?? "";
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-white"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  } `}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.icon} {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const filterByRole = (items: NavItem[]) => {
    return items
      .filter((item) => {
        if (item.roles && !item.roles.includes(role)) return false;
        return true;
      })
      .map((item) => ({
        ...item,
        subItems: item.subItems
          ? item.subItems.filter((sub) =>
              sub.roles ? sub.roles.includes(role) : true,
            )
          : undefined,
      }))
      .filter((item) => {
        if (!item.subItems) return true;
        return item.subItems.length > 0;
      });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-3 px-5  flex border-b border-b-[#f0f0f0] ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/drawings-revisions">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-[#4b0082] text-white p-2 rounded-lg">
                  <Building2 size={28} />
                </div>
                <div className="flex flex-col items-center gap-0 justify-center">
                  <div className="font-semibold text-base">
                    Construction Mgt App
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#4b0082] text-white p-2 rounded-lg">
              <Building2 size={28} />
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col px-5  overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4 mt-4">
            <div>{renderMenuItems(filterByRole(navItems), "main")}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
