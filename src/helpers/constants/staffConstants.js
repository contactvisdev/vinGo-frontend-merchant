export const STAFF_TABLE_COLUMNS = [
  { key: "name", label: "Name", header: "Name" },
  { key: "email", label: "Email", header: "Email" },
  { key: "phone", label: "Phone", header: "Phone" },
  { key: "roles", label: "Role(s)", header: "Role(s)" },
  { key: "action", label: "Action", header: "Action" },
];

export const STAFF_ROLE_OPTIONS = [
  { label: "Regional Manager", value: "REGIONAL_MANAGER" },
  { label: "Outlet Manager", value: "OUTLET_MANAGER" },
  { label: "Staff", value: "STAFF" },
  { label: "Accountant", value: "ACCOUNTANT" },
];

export const DEFAULT_STAFF_SEARCH_DEBOUNCE_DELAY = 400;

export const getDefaultPermissions = () => ({
  dashboard: {
    canView: false,
    canViewOverview: false,
    canViewRecentOrders: false,
    canViewMetrics: false,
  },
  menu: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageCategories: false,
    canManageItems: false,
    canManagePromotionalCategories: false,
    canPublish: false,
  },
  orders: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canUpdateStatus: false,
    canViewDetails: false,
    canExport: false,
  },
   reviews: {
    canView: false,
    canRespond: false,
    canDelete: false,
    canModerate: false,
  },
   analytics: {
    canView: false,
    canViewSales: false,
    canViewOrders: false,
    canViewCustomer: false,
    canExport: false,
  },
  // reports: {
  //   canView: false,
  //   canExport: false,
  //   canViewAnalytics: false,
  //   canViewSales: false,
  //   canViewOrders: false,
  //   canViewReviews: false,
  //   canViewDashboard: false,
  // },

    staff: {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canAssignRoles: false,
    canManagePermissions: false,
    canViewDetails: false,
  },
  //   payments: {
  //   canView: false,
  //   canProcess: false,
  //   canRefund: false,
  //   canViewTransactions: false,
  //   canManageWallet: false,
  //   canViewPayouts: false,
  // },
  settings: {
    canView: false,
    canEdit: false,
    canManageProfile: false,
    canManageHours: false,
    canManageCategories: false,
    canManageNotifications: false,
    canManageWallet: false,
  },
 
});


export const PERMISSIONS_SCHEMA = [
  {
    section: "dashboard",
    title: "Dashboard",
    icon: "LayoutDashboard",
    keys: [
      { key: "canView", label: "View" },
      { key: "canViewOverview", label: "View overview" },
      { key: "canViewRecentOrders", label: "View recent orders" },
      { key: "canViewMetrics", label: "View metrics" },
    ],
  },
  {
    section: "menu",
    title: "Menu",
    icon: "UtensilsCrossed",
    keys: [
      { key: "canView", label: "View" },
      { key: "canCreate", label: "Create" },
      { key: "canEdit", label: "Edit" },
      { key: "canDelete", label: "Delete" },
      { key: "canManageCategories", label: "Manage categories" },
      { key: "canManageItems", label: "Manage items" },
      { key: "canManagePromotionalCategories", label: "Manage promotional categories" },
      // { key: "canPublish", label: "Publish" },
    ],
  },
   {
    section: "orders",
    title: "Orders",
    icon: "ShoppingBag",
    keys: [
      { key: "canView", label: "View" },
      { key: "canCreate", label: "Create" },
      { key: "canEdit", label: "Edit" },
      { key: "canDelete", label: "Delete" },
      { key: "canUpdateStatus", label: "Update status" },
      { key: "canViewDetails", label: "View details" },
      { key: "canExport", label: "Export" },
    ],
  },
   {
    section: "reviews",
    title: "Reviews",
    icon: "Star",
    keys: [
      { key: "canView", label: "View" },
      { key: "canRespond", label: "Respond" },
      { key: "canDelete", label: "Delete" },
      // { key: "canViewDetails", label: "View details" },
      // { key: "canModerate", label: "Moderate" },
    ],
  },
  {
    section: "analytics",
    title: "Analytics",
    icon: "BarChart3",
    keys: [
      { key: "canView", label: "View" },
      { key: "canViewSales", label: "View sales" },
      { key: "canViewOrders", label: "View orders" },
      { key: "canViewCustomer", label: "View customer" },
      { key: "canExport", label: "Export" },
    ],
  },
  {
    section: "staff",
    title: "Staff",
    icon: "Users",
    keys: [
      { key: "canView", label: "View" },
      { key: "canCreate", label: "Create" },
      { key: "canEdit", label: "Edit" },
      { key: "canDelete", label: "Delete" },
      { key: "canAssignRoles", label: "Assign roles" },
      { key: "canManagePermissions", label: "Manage permissions" },
      { key: "canViewDetails", label: "View details" },
    ],
  },
  // {
  //   section: "reports",
  //   title: "Reports",
  //   icon: "FileText",
  //   keys: [
  //     { key: "canView", label: "View" },
  //     { key: "canExport", label: "Export" },
  //     { key: "canViewAnalytics", label: "View analytics" },
  //     { key: "canViewSales", label: "View sales" },
  //     { key: "canViewOrders", label: "View orders" },
  //     { key: "canViewReviews", label: "View reviews" },
  //     { key: "canViewDashboard", label: "View dashboard" },
  //   ],
  // },
  // {
  //   section: "payments",
  //   title: "Payments",
  //   icon: "CreditCard",
  //   keys: [
  //     { key: "canView", label: "View" },
  //     { key: "canProcess", label: "Process" },
  //     { key: "canRefund", label: "Refund" },
  //     { key: "canViewTransactions", label: "View transactions" },
  //     { key: "canManageWallet", label: "Manage wallet" },
  //     { key: "canViewPayouts", label: "View payouts" },
  //   ],
  // },
  {
    section: "settings",
    title: "Settings",
    icon: "Settings",
    keys: [
      { key: "canView", label: "View" },
      { key: "canEdit", label: "Edit" },
      { key: "canManageProfile", label: "Manage profile" },
      { key: "canManageHours", label: "Manage hours" },
      // { key: "canManageCategories", label: "Manage categories" },
      // { key: "canManageNotifications", label: "Manage notifications" },
      // { key: "canManageWallet", label: "Manage wallet" },
    ],
  },
  
  
];
