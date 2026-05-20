import React, { useCallback, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  ShoppingCart,
  Star,
  BarChart3,
  Users,
  Settings,
  LogOut,
  X,
  Package,
  Pill,
  ChevronDown,
  Tag,
  LayoutList,
  Layers,
  Landmark,
  Wine,
  Wallet as WalletIcon,
  Receipt,
  Banknote,
} from "lucide-react";
import lines from "@/assets/images/icons/lines.png";
import Logo from "@/components/ui/Logo/Logo";
import usePermission from "@/hooks/usePermission";
import { useSelector } from "react-redux";
import SkeletonImage from "@/components/ui/SkeletonImage";

const getDynamicMenuEntry = (category) => {
  switch (category?.toLowerCase()) {
    case "grocery":
      return {
        icon: Package,
        label: "Product Management",
        path: "/manage-products",
        activePaths: ["/manage-products", "/menu-item/"],
        permission: { module: "menu", action: "canView" },
        children: [
          {
            icon: Package,
            label: "Products",
            path: "/manage-products",
            activePaths: ["/manage-products", "/menu-item/"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Menu Catalog",
            path: "/manage-products/menu-catalog",
            activePaths: ["/manage-products/menu-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Tag,
            label: "Promotional Catalogs",
            path: "/manage-products/promotional-categories",
            activePaths: ["/manage-products/promotional-categories"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Layers,
            label: "Combos",
            path: "/manage-products/combos",
            activePaths: ["/manage-products/combos"],
            permission: { module: "menu", action: "canView" },
          },
          // {
          //   icon: Package,
          //   label: "Product Types",
          //   path: "/manage-products/product-type",
          //   activePaths: ["/manage-products/product-type"],
          //   permission: { module: "menu", action: "canView" },
          // },
        ],
      };
    case "pharmacy":
      return {
        icon: Pill,
        label: "Medicine Management",
        path: "/manage-medicines",
        activePaths: ["/manage-medicines", "/menu-item/"],
        permission: { module: "menu", action: "canView" },
        children: [
          {
            icon: Pill,
            label: "Medicines",
            path: "/manage-medicines",
            activePaths: ["/manage-medicines", "/menu-item/"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Menu Catalog",
            path: "/manage-medicines/menu-catalog",
            activePaths: ["/manage-medicines/menu-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Sub Catalog",
            path: "/manage-medicines/sub-catalog",
            activePaths: ["/manage-medicines/sub-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Tag,
            label: "Promotional Catalogs",
            path: "/manage-products/promotional-categories",
            activePaths: ["/manage-products/promotional-categories"],
            permission: { module: "menu", action: "canView" },
          },
          // {
          //   icon: Tag,
          //   label: "Promotional catalog ",
          //   path: "/manage-medicines/promotional-categories",
          //   activePaths: ["/manage-medicines/promotional-categories"],
          //   permission: { module: "menu", action: "canView" },
          // },
          // {
          //   icon: Layers,
          //   label: "Combos",
          //   path: "/manage-medicines/combos",
          //   activePaths: ["/manage-medicines/combos"],
          //   permission: { module: "menu", action: "canView" },
          // },
        ],
      };
    case "liquor":
      return {
        icon: Wine,
        label: "Liquor Management",
        path: "/manage-liquor",
        activePaths: ["/manage-liquor", "/menu-item/"],
        permission: { module: "menu", action: "canView" },
        children: [
          {
            icon: Wine,
            label: "Liquor Products",
            path: "/manage-liquor",
            activePaths: ["/manage-liquor", "/menu-item/"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Menu Catalog",
            path: "/manage-liquor/menu-catalog",
            activePaths: ["/manage-liquor/menu-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Sub Catalog",
            path: "/manage-liquor/sub-catalog",
            activePaths: ["/manage-liquor/sub-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Tag,
            label: "Promotional Catalogs",
            path: "/manage-liquor/promotional-categories",
            activePaths: ["/manage-liquor/promotional-categories"],
            permission: { module: "menu", action: "canView" },
          },
        ],
      };
    default:
      return {
        icon: UtensilsCrossed,
        label: "Menu Management",
        path: "/manage-menu",
        activePaths: ["/manage-menu", "/menu-item/"],
        permission: { module: "menu", action: "canView" },
        children: [
          {
            icon: UtensilsCrossed,
            label: "Menu Items",
            path: "/manage-menu",
            activePaths: ["/manage-menu", "/menu-item/"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Layers,
            label: "Combos",
            path: "/manage-menu/combos",
            activePaths: ["/manage-menu/combos"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: LayoutList,
            label: "Menu Catalog",
            path: "/manage-menu/menu-catalog",
            activePaths: ["/manage-menu/menu-catalog"],
            permission: { module: "menu", action: "canView" },
          },
          {
            icon: Tag,
            label: "Promotional catalog",
            path: "/manage-menu/promotional-categories",
            activePaths: ["/manage-menu/promotional-categories"],
            permission: { module: "menu", action: "canView" },
          },
        ],
      };
  }
};

const Tooltip = ({ label }) => (
  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-out pointer-events-none z-50 shadow-lg">
    {label}
    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
  </span>
);

const Sidebar = React.memo(
  ({
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
    collapsed,
    toggleCollapsed,
  }) => {
    const location = useLocation();
    const handleCloseSidebar = useCallback(() => {
      setSidebarOpen(false);
    }, [setSidebarOpen]);

    const businessCategoryName = useSelector(
      (state) => state?.businessProfile?.profile?.categoryName,
    );

    const hasPermission = usePermission();

    const fullMenuItems = useMemo(
      () => [
        {
          icon: Home,
          label: "Dashboard",
          path: "/dashboard",
          permission: { module: "dashboard", action: "canView" },
        },
        getDynamicMenuEntry(businessCategoryName),
        {
          icon: ShoppingCart,
          label: "Orders",
          path: "/orders",
          permission: { module: "orders", action: "canView" },
        },
        {
          icon: Star,
          label: "Reviews",
          path: "/reviews",
          permission: { module: "reviews", action: "canView" },
        },
        {
          icon: BarChart3,
          label: "Analytics",
          path: "/analytics",
          permission: { module: "analytics", action: "canView" },
        },
        {
          icon: Users,
          label: "Staff",
          path: "/staff",
          permission: { module: "staff", action: "canView" },
        },
        {
          icon: Banknote,
          label: "Finance",
          path: "/finance",
          activePaths: ["/finance", "/bank-details"],
          permission: { module: "settings", action: "canView" },
          children: [
            {
              icon: Landmark,
              label: "Bank Details",
              path: "/finance/bank-details",
              activePaths: ["/finance/bank-details", "/bank-details"],
              permission: { module: "settings", action: "canView" },
            },
            {
              icon: Receipt,
              label: "Transaction History",
              path: "/finance/transactions",
              activePaths: ["/finance/transactions"],
              permission: { module: "settings", action: "canView" },
            },
            {
              icon: WalletIcon,
              label: "Wallet",
              path: "/finance/wallet",
              activePaths: ["/finance/wallet"],
              permission: { module: "settings", action: "canView" },
            },
          ],
        },
        {
          icon: Settings,
          label: "Settings",
          path: "/settings",
          permission: { module: "settings", action: "canView" },
        },
      ],
      [businessCategoryName],
    );

    const filteredMenuItems = useMemo(
      () =>
        fullMenuItems
          .filter((item) => {
            if (!item.permission) return true;
            return hasPermission(
              item.permission.module,
              item.permission.action,
            );
          })
          .map((item) => {
            if (item.children?.length) {
              const filteredChildren = item.children.filter((child) => {
                if (!child.permission) return true;
                return hasPermission(
                  child.permission.module,
                  child.permission.action,
                );
              });
              return { ...item, children: filteredChildren };
            }
            return item;
          })
          .filter((item) => {
            if (item.children?.length) return item.children.length > 0;
            return true;
          }),
      [fullMenuItems, hasPermission],
    );

    const [expandedItems, setExpandedItems] = useState({});

    const isParentExpanded = useCallback(
      (item) => {
        const hasActiveChild = item.children?.some(
          (c) =>
            location.pathname === c.path ||
            location.pathname.startsWith(c.path + "/"),
        );
        if (hasActiveChild) return true;
        return expandedItems[item.label] ?? false;
      },
      [location.pathname, expandedItems],
    );

    const toggleExpanded = useCallback((label) => {
      setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
    }, []);
    const labelClasses = collapsed
      ? "max-w-0 opacity-0 ml-0"
      : "max-w-[180px] opacity-100 ml-3";

    return (
      <div
        className={`fixed top-0 left-0 h-full bg-white z-40 flex flex-col transition-[width,transform] duration-300 ease-in-out lg:relative ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "w-20" : "w-[266px]"}`}
      >
        {/* Header */}
        <div
          className="shrink-0 transition-[padding] duration-300 ease-in-out p-4 lg:p-6"
          style={collapsed ? { padding: "1rem" } : undefined}
        >
          <div className="flex items-center justify-between relative">
            <div className="shrink-0 flex items-center justify-center !w-full h-15">
              <Logo alt="logo" width={50} height={50} />
            </div>

            {/* Mobile close button — always rendered, hidden on desktop */}
            <div>
              <button
                onClick={handleCloseSidebar}
                className={`lg:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-200 absolute top-2 right-2 ${
                  collapsed
                    ? "opacity-70 pointer-events-none w-0"
                    : "opacity-100"
                }`}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Desktop collapse/expand button */}
              <button
                onClick={toggleCollapsed}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              ></button>
              {/* <ChevronsLeft
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
                    collapsed ? "rotate-180" : "rotate-0"
                  }`}
                /> */}
              <div
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ml-2 absolute top-[16%] hidden lg:block`}
              >
                <SkeletonImage src={lines} alt="lines" onClick={toggleCollapsed} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={`space-y-3 grow transition-[padding] duration-300 ease-in-out ${collapsed ? "px-3 overflow-visible" : "px-6 overflow-x-hidden overflow-y-auto"}`}
        >
          {filteredMenuItems.map((item) => {
            if (!item.path && !item.children?.length) {
              return (
                <div key={item.label} className="relative group">
                  <button
                    className={`w-full flex items-center p-3 rounded-md 2xl:text-sm lg:text-xs text-[10px] bg-neutral-200 text-neutral-500 cursor-not-allowed transition-all duration-300 ease-in-out ${
                      collapsed ? "justify-center" : ""
                    }`}
                    disabled
                  >
                    <item.icon size={20} className="text-gray-400 shrink-0" />
                    <span
                      className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${labelClasses}`}
                    >
                      {item.label}
                    </span>
                  </button>
                  {collapsed && <Tooltip label={item.label} />}
                </div>
              );
            }

            // Multi-child tab: expandable parent with nested children
            if (item.children?.length) {
              const expanded = isParentExpanded(item);
              const hasActiveChild = item.children.some(
                (c) =>
                  location.pathname === c.path ||
                  location.pathname.startsWith(c.path + "/"),
              );
              const parentClasses = `w-full flex items-center p-3 rounded-md 2xl:text-sm lg:text-xs text-[10px] transition-all duration-300 ease-in-out ${
                collapsed ? "justify-center" : ""
              } ${
                hasActiveChild
                  ? "bg-linear-to-r from-primary to-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`;

              const parentContent = (
                <>
                  <item.icon
                    size={20}
                    className={`shrink-0 ${
                      hasActiveChild ? "text-white" : "text-primary"
                    }`}
                  />
                  <span
                    className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${labelClasses}`}
                  >
                    {item.label}
                  </span>
                  {!collapsed && (
                    <ChevronDown
                      size={16}
                      className={`ml-auto shrink-0 transition-transform duration-200 ${
                        hasActiveChild ? "text-white" : "text-neutral-500"
                      } ${expanded ? "rotate-180" : ""}`}
                    />
                  )}
                </>
              );

              return (
                <div key={item.label} className="relative group">
                  {collapsed ? (
                    <NavLink
                      to={item.children[0].path}
                      end={!item.children[0].activePaths}
                      className={parentClasses}
                    >
                      {parentContent}
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.label)}
                      className={parentClasses}
                    >
                      {parentContent}
                    </button>
                  )}
                  {collapsed && <Tooltip label={item.label} />}
                  {!collapsed && expanded && (
                    <div className="ml-4 mt-1 space-y-1 pl-3">
                      {item.children.map((child) => {
                        // Check exact path match first
                        const exactMatch = location.pathname === child.path;

                        // Get all other child paths to check for more specific matches
                        const otherChildPaths = item.children
                          .filter((c) => c.path !== child.path)
                          .map((c) => c.path);

                        // Check if current pathname matches a more specific child path
                        const hasMoreSpecificMatch = otherChildPaths.some(
                          (otherPath) =>
                            location.pathname === otherPath ||
                            location.pathname.startsWith(otherPath + "/"),
                        );

                        let childActive = exactMatch;

                        // Only check activePaths if there's no exact match and no more specific child match
                        if (
                          !childActive &&
                          !hasMoreSpecificMatch &&
                          child.activePaths
                        ) {
                          childActive = child.activePaths.some((p) => {
                            // For paths ending with "/" (like "/menu-item/"), use startsWith
                            if (p.endsWith("/")) {
                              return location.pathname.startsWith(p);
                            }
                            // For exact paths (like "/manage-menu"), only match exactly
                            return location.pathname === p;
                          });
                        }

                        // Determine if this child path should use exact matching (end={true})
                        // Use exact matching if the path doesn't have a trailing pattern like "/menu-item/"
                        const useExactMatch =
                          !child.activePaths ||
                          !child.activePaths.some((p) => p.endsWith("/"));

                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end={useExactMatch}
                            className={() => {
                              return `flex items-center gap-2 p-2 rounded-md text-xs transition-all duration-200 ${
                                childActive
                                  ? "bg-linear-to-r from-primary/20 to-primary-600/20 text-primary font-medium"
                                  : "text-neutral-600 hover:bg-neutral-100"
                              }`;
                            }}
                          >
                            {ChildIcon && (
                              <ChildIcon
                                size={16}
                                className={`shrink-0 ${childActive ? "text-primary" : "text-neutral-500"}`}
                              />
                            )}
                            <span className="font-medium whitespace-nowrap overflow-hidden">
                              {child.label}
                            </span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActiveByPath = item.activePaths
              ? item.activePaths.some((p) => location.pathname.startsWith(p))
              : false;

            return (
              <div key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  end={!item.activePaths}
                  className={({ isActive }) => {
                    const active = isActive || isActiveByPath;
                    return `w-full flex items-center p-3 rounded-md 2xl:text-sm lg:text-xs text-[10px] transition-all duration-300 ease-in-out ${
                      collapsed ? "justify-center" : ""
                    } ${
                      active
                        ? "bg-linear-to-r from-primary to-primary-600 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const active = isActive || isActiveByPath;
                    return (
                      <>
                        <item.icon
                          size={20}
                          className={`shrink-0 ${
                            active ? "text-white" : "text-primary"
                          }`}
                        />
                        <span
                          className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${labelClasses}`}
                        >
                          {item.label}
                        </span>
                      </>
                    );
                  }}
                </NavLink>
                {collapsed && <Tooltip label={item.label} />}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className={`shrink-0 transition-[padding] duration-300 ease-in-out ${collapsed ? "p-3" : "p-6"}`}
        >
          <div className="relative group">
            <button
              className={`w-full flex items-center p-3 bg-neutral-100 2xl:text-sm lg:text-xs text-[10px] text-gray-600 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-200 ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-primary shrink-0" />
              <span
                className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${labelClasses}`}
              >
                Logout
              </span>
            </button>
            {collapsed && <Tooltip label="Logout" />}
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
