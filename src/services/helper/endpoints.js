const endPoints = {
  CHECK_IN: "merchants/profile/checkUserExists",
  LOGIN: "merchants/auth/login",
  SIGNUP: "merchants/auth/signup",
  REQUEST_MOBILE_OTP: "merchants/auth/mobile-otp",
  VERIFY_OTP: "merchants/auth/verifyMobileOTP",
  RESEND_OTP: "merchants/auth/mobile-otp",
  UPDATE_MERCHANT: "merchants/profile",
  CREATE_MERCHANT: "merchants/profile",
  DELETE_MERCHANT: "merchants/profile",
  CATEGORIES: "category",
  GET_PROFILE: "merchants/profile",
  GET_ALL_USER_PROFILE: "merchants/profile",
  GET_MERCHANTS_BY_OWNER: "merchants/profile",
  UPLOAD_SINGLE: "upload/single",
  UPLOAD_MULTIPLE: "upload/multiple",
  CATALOG: "catalog",
  REORDER_CATALOGS: "catalog/reorderCatalogs",
  SUB_CATALOG: "sub-catalog",
  SUB_CATALOG_BY_ID: (id) => `sub-catalog/${id}`,
  PROMOTIONAL_CATALOG: "promotionalCatalog",
  ITEMS: "items",
  FOOD_TYPE: "food-type",
  CATALOG_BY_ID: (id) => `catalog/${id}`,
  PRODUCT_TYPE: "productType",
  PRODUCT_TYPE_BY_ID: (id) => `productType/${id}`,
  STORE_TYPE: "storeType",

  // DashBoard
  OVERVIEW: "merchants/dashboard/overview",
  RECENT_ORDER: "merchants/dashboard/recent-orders",
  SALES_CHART: "merchants/dashboard/sales-trends",

  // Restaurant Orders
  RESTAURANT_ORDERS: "merchants/dashboard/orderData",
  RESTAURANT_DECISION: "order",
  RESTAURANT_ORDERS_DETAILS: "order",
  VERIFY_PICKUP_OTP: "order/verifyPickupOtp",
  PROCESS_ORDER_PAYMENT: "order/processOrderPayment",

  // Analytics
  ANALYTICS_OVERVIEW: "merchants/analytics/overview",
  ANALYTICS_SALES_PERFORMANCE: "merchants/analytics/salesPerformance",

  // Reviews
  REVIEWS: "merchants/dashboard/reviewData",

  // Business Staff
  BUSINESS_STAFF: "business-staff",
  BUSINESS_STAFF_DELETE: "business-staff/",
  BUSINESS_STAFF_BY_ID: (id) => `business-staff/${id}`,
  REQUEST_EMAIL_OTP: "merchants/auth/requestOtp",
  STAFF_LOGIN: "merchants/auth/login",
  STAFF_MOBILE_OTP: "merchants/auth/mobile-otp",

  // Notifications
  NOTIFICATION_READ_ALL: "notification/read-all",

  // Combo
  COMBO: "combo",

  // Bank Details
  BANK_DETAILS: "bank-details",
  BANK_DETAILS_BY_ID: (id) => `bank-details/${id}`,

  // Wallet
  WALLET: "wallet",
  WALLET_BY_ID: (id) => `wallet/${id}`,

  // Transactions
  TRANSACTION: "transaction",
  TRANSACTION_BY_ID: (id) => `transaction/${id}`,

  // Terms & Policy
  TERMS_POLICY: "terms-policy",
};
export default endPoints;
