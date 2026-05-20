import formValidation from "@/helpers/validations";

export default function validateRestaurantMenuForm(data, dropdownValues, ignore = []) {
  let hasError = false;
  const formErrors = { ...data.formErrors };

  Object.keys(data).forEach((key) => {
    if (key === "formErrors" || key === "variants" || key === "addons") return;
    if (ignore.includes(key)) return;
    const fieldErrors = formValidation(key, data[key], data);
    if (fieldErrors[key]) {
      formErrors[key] = fieldErrors[key];
      hasError = true;
    } else {
      delete formErrors[key];
    }
  });

  const dropdownErrors = {
    catalog:  dropdownValues.catalog ? "" : "Please select a catalog",
    foodType: dropdownValues.foodType ? "" : "Please select food type",
    promo: "",
    prepTime: dropdownValues.prepTime ? "" : "Please select preparation time",
  };

  if ((!ignore.includes("catalogId") && !dropdownValues.catalog) || !dropdownValues.foodType || !dropdownValues.prepTime) {
    hasError = true;
  }

  data.variants.forEach((v, index) => {
    if (!v.name?.trim()) {
      formErrors[`variant_${index}_name`] = "Variant Name is required";
      hasError = true;
    } else {
      delete formErrors[`variant_${index}_name`];
    }
    if (!String(v.price || "").trim()) {
      formErrors[`variant_${index}_price`] = "Price is required";
      hasError = true;
    } else if (Number(v.price) <= 0) {
      formErrors[`variant_${index}_price`] = "Price must be greater than 0";
      hasError = true;
    } else {
      delete formErrors[`variant_${index}_price`];
    }
  });

  const hasTopLevelVariant = !!data.defaultVariantName?.trim();
  const hasListVariant = (data.variants || []).length > 0;
  const topLevelIsDefault = !!data.isDefaultVariant;
  const listHasDefault = (data.variants || []).some((v) => v.isDefault);

  if ((hasTopLevelVariant || hasListVariant) && !topLevelIsDefault && !listHasDefault) {
    formErrors.defaultVariantRequired = "Please mark one variant as default";
    hasError = true;
  } else {
    delete formErrors.defaultVariantRequired;
  }

  if (data.isDefaultVariant && !hasTopLevelVariant) {
    formErrors.defaultVariantName = "Please enter a variant name";
    hasError = true;
  } else {
    delete formErrors.defaultVariantName;
  }

  data.addons.forEach((a, index) => {
    if (!a.name?.trim()) {
      formErrors[`addon_${index}_name`] = "Add-on Name is required";
      hasError = true;
    } else {
      delete formErrors[`addon_${index}_name`];
    }
    if (!String(a.price || "").trim()) {
      formErrors[`addon_${index}_price`] = "Price is required";
      hasError = true;
    } else if (Number(a.price) <= 0) {
      formErrors[`addon_${index}_price`] = "Price must be greater than 0";
      hasError = true;
    } else {
      delete formErrors[`addon_${index}_price`];
    }
  });

  return { hasError, formErrors, dropdownErrors };
}
