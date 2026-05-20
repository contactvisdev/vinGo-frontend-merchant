import lazyWithRetry from "@/helpers/lazyWithRetry";

import LandingPage  from "@/features/public/pages/LandingPage";
//  const LandingPage = lazyWithRetry(() => import("@/features/public/pages/LandingPage"));
const PrivacyPolicy = lazyWithRetry(() => import("@/features/public/pages/PrivacyPolicy"));
const TermsConditions = lazyWithRetry(() => import("@/features/public/pages/TermsConditions"));
const Login = lazyWithRetry(() => import("@/features/auth/pages/Login"));
const OtpVerification = lazyWithRetry(
  () => import("@features/auth/pages/OtpVerification/OtpVerification"),
);
const SelectCategory = lazyWithRetry(
  () => import("@features/auth/pages/SelectCategory/SelectCategory"),
);
const OnboardingWizard = lazyWithRetry(
  () => import("@features/onboarding-v2/pages/OnboardingWizard"),
);
const Submitted = lazyWithRetry(
  () => import("@features/onboarding-v2/pages/SubmittedPage"),
);
const Dashboard = lazyWithRetry(() => import("@features/dashboard/pages/Dashboard"));
const Settings = lazyWithRetry(() => import("@features/settings/pages/Settings"));
const ViewItem = lazyWithRetry(
  () => import("@features/onboarding-v2/pages/ViewItemPage"),
);

// Restaurant private pages
const ManageMenu = lazyWithRetry(
  () => import("@/features/menuManagement/pages/ManageMenu"),
);
const MenuItemDetails = lazyWithRetry(
  () => import("@/features/menuManagement/pages/MenuItemDetails"),
);
const Orders = lazyWithRetry(() => import("@/features/orderManagement/pages/Orders"));
const ViewOrder = lazyWithRetry(
  () => import("@/features/orderManagement/pages/ViewOrder"),
);
const Reviews = lazyWithRetry(() => import("@features/review/pages/Reviews"));
const Analytics = lazyWithRetry(() => import("@features/analytics/pages/Analytics"));
const StaffList = lazyWithRetry(() => import("@features/businessStaff/pages/StaffList"));
const StaffForm = lazyWithRetry(() => import("@features/businessStaff/pages/StaffForm"));
const StaffView = lazyWithRetry(() => import("@features/businessStaff/pages/ViewStaff"));
const BankDetailsList = lazyWithRetry(
  () => import("@/features/bankdetails/pages/BankDetailsList"),
);
const FinanceLayout = lazyWithRetry(
  () => import("@/features/finance/pages/FinanceLayout"),
);
// GroceryProductSetup and PharmacyProductSetup replaced by unified ProductSetupPage

const PromotionalCategory = lazyWithRetry(
  () => import("@/features/menuManagement/pages/PromotionalCategory"),
);
const MenuCatalog = lazyWithRetry(
  () => import("@/features/menuManagement/pages/MenuCatalog"),
);
const SubCatalog = lazyWithRetry(
  () => import("@/features/menuManagement/pages/SubCatalog"),
);
const Combos = lazyWithRetry(
  () => import("@/features/menuManagement/pages/Combos"),
);

export const LandingPageRoutes = [
  {
    path: "/",
    name: "Landing Page",
    component: LandingPage,
    exact: true,
  },
  {
    path: "/privacy-policy/:userType",
    name: "Privacy Policy",
    component: PrivacyPolicy,
    exact: true,
  },
  {
    path: "/terms-conditions/:userType",
    name: "Terms & Conditions",
    component: TermsConditions,
    exact: true,
  },
];

export const PublicRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    exact: true,
  },
  {
    path: "/otp-verification",
    name: "OTP Verification",
    component: OtpVerification,
    exact: true,
  },

];

export const OnboardingRoutes = [
  {
    path: "/select-category",
    name: "Select Category",
    component: SelectCategory,
    exact: true,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: OnboardingWizard,
    exact: true,
  },
  {
    path: "/view-items",
    name: "viewitem",
    component: ViewItem,
    exact: true,
  },
  {
    path: "/submitted",
    name: "Submitted",
    component: Submitted,
    exact: true,
  },
];

export const PrivateRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    exact: true,
    title: "Dashboard",
    subtitle: "Welcome to your restaurant dashboard",
    meta: { permission: { module: "dashboard", action: "canView" } },
  },
  {
    path: "/manage-menu",
    name: "Manage Menu",
    component: ManageMenu,
    exact: true,
    title: "Menu Management",
    subtitle:
      "Manage your restaurant menu items, categories, and availability settings.",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-menu/menu-catalog",
    name: "Menu Catalog",
    component: MenuCatalog,
    exact: true,
    // title: "Menu Catalog",
    // subtitle: "Manage menu categories and catalogs",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-menu/promotional-categories",
    name: "Promotional Catalog",
    component: PromotionalCategory,
    exact: true,
    title: null,
    subtitle: null,
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-menu/combos",
    name: "Combos",
    component: Combos,
    exact: true,
    title: "Combos",
    subtitle: "Manage combo offers for your menu items",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-products",
    name: "Manage Products",
    component: ManageMenu,
    exact: true,
    title: "Manage Products",
    subtitle: "Manage grocery products and inventory",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-products/menu-catalog",
    name: "Menu Catalog",
    component: MenuCatalog,
    exact: true,
    title: "Menu Catalog",
    subtitle: "Manage product categories and catalogs",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-products/promotional-categories",
    name: "Promotional Categories",
    component: PromotionalCategory,
    exact: true,
    title: "Promotional Categories",
    subtitle: "Manage promotional categories for your products",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-products/combos",
    name: "Combos",
    component: Combos,
    exact: true,
    title: "Combos",
    subtitle: "Manage combo offers for your products",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  // {
  //   path: "/manage-products/product-type",
  //   name: "Product Type",
  //   component: ProductType,
  //   exact: true,
  //   title: "Product Types",
  //   subtitle: "Manage product types for your products",
  //   meta: { permission: { module: "menu", action: "canView" } },
  // },
  {
    path: "/manage-medicines",
    name: "Manage Medicines",
    component: ManageMenu,
    exact: true,
    title: "Manage Medicines",
    subtitle: "Manage pharmacy medicines and health products",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-medicines/menu-catalog",
    name: "Menu Catalog",
    component: MenuCatalog,
    exact: true,
    title: "Menu Catalog",
    subtitle: "Manage medicine categories and catalogs",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-medicines/sub-catalog",
    name: "Sub Catalog",
    component: SubCatalog,
    exact: true,
    title: "Sub Catalog",
    subtitle: "Manage medicine sub categories",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-medicines/promotional-categories",
    name: "Promotional Categories",
    component: PromotionalCategory,
    exact: true,
    title: "Promotional Categories",
    subtitle: "Manage promotional categories for your medicines",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-medicines/combos",
    name: "Combos",
    component: Combos,
    exact: true,
    title: "Combos",
    subtitle: "Manage combo offers for your medicines",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-liquor",
    name: "Manage Liquor",
    component: ManageMenu,
    exact: true,
    title: "Manage Liquor",
    subtitle: "Manage liquor products and inventory",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-liquor/menu-catalog",
    name: "Menu Catalog",
    component: MenuCatalog,
    exact: true,
    title: "Menu Catalog",
    subtitle: "Manage liquor categories and catalogs",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-liquor/sub-catalog",
    name: "Sub Catalog",
    component: SubCatalog,
    exact: true,
    title: "Sub Catalog",
    subtitle: "Manage liquor sub categories",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-liquor/promotional-categories",
    name: "Promotional Categories",
    component: PromotionalCategory,
    exact: true,
    title: "Promotional Categories",
    subtitle: "Manage promotional categories for your liquor products",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/manage-liquor/combos",
    name: "Combos",
    component: Combos,
    exact: true,
    title: "Combos",
    subtitle: "Manage combo offers for your liquor products",
    meta: { permission: { module: "menu", action: "canView" } },
  },
  {
    path: "/menu-item/:id",
    name: "",
    component: MenuItemDetails,
    exact: true,
    // title: "Menu Item Details",
    // subtitle: "View detailed information about menu item",
    breadcrumb: [
      // { label: "Dashboard", path: "/dashboard" },
      { label: "Menu Management", path: "/manage-menu" },
      { label: "View Details", path: null },
    ],
    meta: { permission: { module: "menu", action: "canViewDetails" } },
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    exact: true,
    title: "Orders Management",
    subtitle:
      "Track and manage all restaurant orders, update status, and communicate with customers.",
    meta: { permission: { module: "orders", action: "canView" } },
  },
  {
    path: "/orders/:id",
    name: "View Order",
    component: ViewOrder,
    exact: true,
    // title: "Order Details",
    // subtitle: "View order information and track delivery status",
    meta: { permission: { module: "orders", action: "canViewDetails" } },
  },
  {
    path: "/reviews",
    name: "Reviews",
    component: Reviews,
    exact: true,
    title: "Reviews Management",
    subtitle:
      "View and manage customer reviews, ratings, and responses to improve your restaurant's reputation.",
    meta: { permission: { module: "reviews", action: "canView" } },
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
    exact: true,
    title: "Analytics Overview",
    subtitle:
      "Monitor your restaurant's performance with real-time sales, order trends, and customer feedback data.",
    meta: { permission: { module: "analytics", action: "canView" } },
  },
  {
    path: "/staff/new",
    name: "Add Staff",
    component: StaffForm,
    exact: true,
    title: "Add Staff",
    subtitle: "Create a new staff member and set permissions.",
    meta: { permission: { module: "staff", action: "canCreate" } },
  },
  {
    path: "/staff/:id/edit",
    name: "Edit Staff",
    component: StaffForm,
    exact: true,
    title: "Edit Staff",
    subtitle: "Update staff member and permissions.",
    meta: { permission: { module: "staff", action: "canEdit" } },
  },
  {
    path: "/staff/:id",
    name: "View Staff",
    component: StaffView,
    exact: true,
    title: "Staff Details",
    subtitle: "View staff member details and permissions.",
    meta: { permission: { module: "staff", action: "canViewDetails" } },
  },
  {
    path: "/staff",
    name: "Staff",
    component: StaffList,
    exact: true,
    title: "Staff Management",
    subtitle: "Manage staff members, roles, and permissions.",
    meta: { permission: { module: "staff", action: "canView" } },
  },
  {
    path: "/bank-details",
    name: "Bank Details",
    component: BankDetailsList,
    exact: true,
    title: "Bank Details",
    subtitle: "Manage your bank accounts for payouts",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  {
    path: "/finance",
    name: "Finance",
    component: FinanceLayout,
    exact: true,
    title: "Finance",
    subtitle: "Manage bank accounts, wallet balance, and transactions",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  {
    path: "/finance/bank-details",
    name: "Finance - Bank Details",
    component: FinanceLayout,
    exact: true,
    title: "Finance",
    subtitle: "Manage your bank accounts for payouts",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  {
    path: "/finance/transactions",
    name: "Finance - Transactions",
    component: FinanceLayout,
    exact: true,
    title: "Finance",
    subtitle: "Review your transaction history",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  {
    path: "/finance/wallet",
    name: "Finance - Wallet",
    component: FinanceLayout,
    exact: true,
    title: "Finance",
    subtitle: "View your wallet balance and payout activity",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    exact: true,
    title: "Settings",
    subtitle: "Manage your restaurant settings",
    meta: { permission: { module: "settings", action: "canView" } },
  },
  ];
