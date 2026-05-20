export const BUSINESS_CATEGORIES = {
  RESTAURANT: {
    name: "Restaurant",
    slug: "restaurant",
    displayName: "Restaurant",
    itemLabel: "Menu Item",
    itemsLabel: "Menu Items",
    catalogLabel: "Catalog",
    catalogsLabel: "Catalogs",
    menuSetupLabel: "Menu Setup",
    menuSetupDescription:
      "Create your restaurant menu by adding categories, items, and customization options",
    documentsLabel: "Restaurant Documents",
    documentsDescription:
      "Upload your business registration, license, and ID documents to verify your restaurant and activate your account.",
    informationLabel: "Restaurant Information",
    informationDescription: "Provide your restaurant details to get started",
  },
  PHARMACY: {
    name: "Pharmacy",
    slug: "pharmacy",
    displayName: "Pharmacy",
    itemLabel: "Product",
    itemsLabel: "Products",
    catalogLabel: "Catalog",
    catalogsLabel: "Catalogs",
    menuSetupLabel: "Pharmacy Product Setup",
    menuSetupDescription:
      "Create your pharmacy catalog by adding categories, products, and pricing options",
    documentsLabel: "Pharmacy Documents",
    documentsDescription:
      "Upload your business registration, license, and ID documents to verify your pharmacy and activate your account.",
    informationLabel: "Pharmacy Information",
    informationDescription: "Provide your pharmacy details to get started",
  },
  GROCERY: {
    name: "Grocery",
    slug: "grocery",
    displayName: "Grocery Store",
    itemLabel: "Product",
    itemsLabel: "Products",
    catalogLabel: "Catalog",
    catalogsLabel: "Catalogs",
    menuSetupLabel: "Product Setup",
    menuSetupDescription:
      "Create your grocery catalog by adding categories, products, and pricing options",
    documentsLabel: "Grocery Documents",
    documentsDescription:
      "Upload your business registration, license, and ID documents to verify your grocery store and activate your account.",
    informationLabel: "Grocery Information",
    informationDescription: "Provide your grocery store details to get started",
  },
  LIQUOR: {
    name: "Liquor",
    slug: "liquor",
    displayName: "Liquor Store",
    itemLabel: "Product",
    itemsLabel: "Products",
    catalogLabel: "Catalog",
    catalogsLabel: "Catalogs",
    menuSetupLabel: "Liquor Product Setup",
    menuSetupDescription:
      "Create your liquor catalog by adding categories, products, and pricing options",
    documentsLabel: "Liquor Documents",
    documentsDescription:
      "Upload your business registration, license, and ID documents to verify your liquor store and activate your account.",
    informationLabel: "Liquor Information",
    informationDescription: "Provide your liquor store details to get started",
  },
};

export const getCategoryConfig = (categoryName) => {
  const category = Object.values(BUSINESS_CATEGORIES).find(
    (cat) => cat.name === categoryName,
  );
  return category || BUSINESS_CATEGORIES.RESTAURANT; 
};

export const getCategoryRoute = (categoryName, page) => {
  const config = getCategoryConfig(categoryName);
  const slug = config.slug;

  const routes = {
    information: `/${slug}-information`,
    documents: `/${slug}-documents`,
    "menu-setup": `/${slug}-menu-setup`,
    review: "/review",
    submitted: "/submitted",
  };

  return routes[page] || `/${slug}-${page}`;
};

export const getRegistrationSteps = (categoryName) => {
  const config = getCategoryConfig(categoryName);
  return [
    `${config.displayName} Information`,
    `${config.displayName} Documents`,
    config.menuSetupLabel,
    "Review & Submit",
  ];
};
