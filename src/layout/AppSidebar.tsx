import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  ChevronDownIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
} from "../icons";
import {
  BadgeDollarSign,
  Box,
  Building2,
  Calculator,
  Car,
  ChartColumn,
  CircleDollarSign,
  CreditCard,
  File,
  FileQuestion,
  FileText,
  Folder,
  FolderGit2,
  FolderKanban,
  House,
  LayoutDashboard,
  NotebookText,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  SquareCheckBig,
  TrendingUp,
  UserRoundCog,
  Users,
  User,
  Lock,
  SettingsIcon,
  Truck,
  Bell,
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
  /*Inventory */
  // {
  //   icon: <Package />,
  //   name: "Inventory",
  //   subItems: [
  //     {
  //       icon: <Package />,
  //       name: "Stock Ledger",
  //       path: "/stock-ledger",
  //       pro: false,
  //     },
  //     {
  //       icon: <Truck />,
  //       name: "Material Issue",
  //       path: "/material-issue",
  //       pro: false,
  //     },
  //     {
  //       icon: <TrendingUp />,
  //       name: "Inventory Forecast",
  //       path: "/inventory-forecast",
  //       pro: false,
  //     },
  //     {
  //       icon: <Bell />,
  //       name: "Reorder Alerts",
  //       path: "/reorder-alerts",
  //       pro: false,
  //     },
  //   ],
  // },

  // {
  //   icon: <Users />,
  //   name: "Investors",
  //   path: "/investors",
  // },
  // {
  //   icon: <Car />,
  //   name: "Vendors",
  //   path: "/vendors",
  // },
  // {
  //   icon: <House />,
  //   name: "Units",
  //   path: "/units",
  // },
  // {
  //   icon: <File />,
  //   name: "Invoices",
  //   path: "/invoices",
  // },
  // {
  //   icon: <CreditCard />,
  //   name: "Payments",
  //   path: "/payments",
  // },

  // {
  //   icon: <CircleDollarSign />,
  //   name: "Expenses",
  //   path: "/expenses",
  // },

  // {
  //   icon: <CircleDollarSign />,
  //   name: "Expenses",
  //   path: "/expenses",
  // },

  // {
  //   icon: <Box />,
  //   name: "Inventory",
  //   path: "/inventory",
  // },

  // {
  //   icon: <ChartColumn />,
  //   name: "Reports",
  //   path: "/reports",
  // },
  // {
  //   icon: <ReceiptText />,
  //   name: "BOQ",
  //   path: "/boq",
  // },

  // {
  //   icon: <ChartColumn />,
  //   name: "Reports",
  //   path: "/reports",
  // },
  // {
  //   icon: <ReceiptText />,
  //   name: "BOQ",
  //   path: "/boq",
  // },

  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Users",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "View Users", path: "/basic-tables", pro: false }],
  // },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // Admin

  {
    icon: <LayoutDashboard />,
    name: "Dashboard",
    path: "/",
    roles: ["SUPER_ADMIN", "MANAGER", "INVESTOR"],
  },
  {
    icon: <FolderGit2 />,
    name: "Project Control",
    roles: ["SUPER_ADMIN", "MANAGER"], // INVESTOR cannot see it
    subItems: [
      {
        icon: <FolderKanban />,
        name: "Project",
        path: "/project",
        pro: false,
        roles: ["SUPER_ADMIN", "MANAGER"],
      },
      // {
      //   icon: <ChartColumn />,
      //   name: "Gantt & Scheduling",
      //   path: "/gantt-scheduling",
      //   pro: false,
      //   roles: ["SUPER_ADMIN", "MANAGER"],
      // },
      // {
      //   icon: <Calculator />,
      //   name: "BOQ & Estimation",
      //   path: "/boq",
      //   pro: false,
      //   roles: ["SUPER_ADMIN", "MANAGER"],
      // },
      {
        icon: <NotebookText />,
        name: "Site Diary (DPR)",
        path: "/site-diary",
        pro: false,
        roles: ["SUPER_ADMIN", "MANAGER"],
      },
      {
        icon: <SquareCheckBig />,
        name: "Task Assignment",
        path: "/task-assignment",
        pro: false,
        roles: ["SUPER_ADMIN", "MANAGER"],
      },
    ],
  },

  /* PROCUREMENT */
  // {
  //   icon: <ShoppingCart />,
  //   name: "Procurement",
  //   roles: ["SUPER_ADMIN", "MANAGER"],
  //   subItems: [
  //     {
  //       icon: <ShoppingCart />,
  //       name: "Purchase Request",
  //       path: "/purchase-request",
  //       pro: false,
  //       roles: ["SUPER_ADMIN", "MANAGER"],
  //     },
  //     {
  //       icon: <FileQuestion />,
  //       name: "Request for Quotation",
  //       path: "/request-for-quotation",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //     {
  //       icon: <FileText />,
  //       name: "Purchase Orders",
  //       path: "/purchase-orders",
  //       pro: false,
  //       roles: ["SUPER_ADMIN", "MANAGER"],
  //     },
  //     {
  //       icon: <Package />,
  //       name: "Goods Received Note",
  //       path: "/goods-received-note",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //   ],
  // },

  /* FINANCE & CRM → Only investors and admins */
  // {
  //   icon: <Calculator />,
  //   name: "Finance & CRM",
  //   roles: ["SUPER_ADMIN", "INVESTOR"],
  //   subItems: [
  //     {
  //       icon: <Users />,
  //       name: "Investors",
  //       path: "/investors",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //     {
  //       icon: <Car />,
  //       name: "Vendors",
  //       path: "/vendors",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //     {
  //       icon: <House />,
  //       name: "My Units",
  //       path: "/units",
  //       pro: false,
  //       roles: ["SUPER_ADMIN", "INVESTOR"],
  //     },
  //     {
  //       icon: <File />,
  //       name: "Invoices",
  //       path: "/invoices",
  //       pro: false,
  //       roles: ["SUPER_ADMIN", "INVESTOR"],
  //     },
  //     {
  //       icon: <CreditCard />,
  //       name: "Payments",
  //       path: "/payments",
  //       pro: false,
  //       roles: ["SUPER_ADMIN", "INVESTOR"],
  //     },
  //     {
  //       icon: <TrendingUp />,
  //       name: "Cash Flow Projection",
  //       path: "/cash-flow-projection",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //     {
  //       icon: <BadgeDollarSign />,
  //       name: "Budget vs Actual",
  //       path: "/budget-actual",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //     {
  //       icon: <Calculator />,
  //       name: "Project Cost Control",
  //       path: "/project-cost-control",
  //       pro: false,
  //       roles: ["SUPER_ADMIN"],
  //     },
  //   ],
  // },

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
      {
        icon: <Lock />,
        name: "Roles & Permissions",
        path: "/roles-and-permissions",
        pro: false,
        roles: ["SUPER_ADMIN"],
      },
      {
        icon: <SettingsIcon />,
        name: "Company Setting",
        path: "/company-setting",
        pro: false,
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      {
        icon: <UserRoundCog />,
        name: "Line Chart",
        path: "/line-chart",
        pro: false,
      },
      {
        icon: <UserRoundCog />,
        name: "Bar Chart",
        path: "/bar-chart",
        pro: false,
      },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { icon: <UserRoundCog />, name: "Alerts", path: "/alerts", pro: false },
      { icon: <UserRoundCog />, name: "Avatar", path: "/avatars", pro: false },
      { icon: <UserRoundCog />, name: "Badge", path: "/badge", pro: false },
      { icon: <UserRoundCog />, name: "Buttons", path: "/buttons", pro: false },
      { icon: <UserRoundCog />, name: "Images", path: "/images", pro: false },
      { icon: <UserRoundCog />, name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
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
  const { role } = useAppSelector((state) => state.auth);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
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
                <ChevronDownIcon
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
              sub.roles ? sub.roles.includes(role) : true
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
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-[#4b0082] text-white p-2 rounded-lg">
                  <Building2 size={28} />
                </div>
                <div className="flex flex-col items-center gap-0 justify-center">
                  <div className="font-semibold text-base">
                    Addis Ababa Jamaat
                  </div>
                  <div className="text-sm">Construction ERP v2</div>
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
            <div>
              {/* <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2> */}
              {renderMenuItems(filterByRole(navItems), "main")}
            </div>
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
