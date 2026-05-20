export const PRODUCT_FIELD_CONFIG = {
  grocery: {
    title: "Grocery Product",
    extraFields: ["brand", "quantity", "pcs", "expiryDate"],
    useDateInput: true,
    requiresProductType: true,
  },
  pharmacy: {
    title: "Pharmacy Product",
    extraFields: ["stockQuantity", "expiryDate"],
    useDateInput: false,
    requiresProductType: false,
  },
  restaurant: {
    title: "Menu Item",
    extraFields: [],
    useDateInput: false,
    requiresProductType: false,
  },
};

export function getInitialProductState(categorySlug) {
  const base = {
    name: "",
    description: "",
    basePrice: "",
    item_img: "",
    availability: true,
    catalogId: "",
    addOns: [],
    formErrors: {},
  };

  if (categorySlug === "grocery") {
    return { ...base, brand: "", quantity: "", pcs: "", expiryDate: "" };
  }
  if (categorySlug === "pharmacy") {
    return { ...base, stockQuantity: "", expiryDate: "" };
  }
  return base;
}
