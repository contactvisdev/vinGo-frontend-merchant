import { entries, notEqual, values } from "./javascript";
import formValidation from "./validations";
import constants from "@/helpers/constants/constants";

export const showFormErrors = (data, setData, ignore, errorName) => {
  let formErrors = {};
  entries(data).forEach(([key, value]) => {
    const result = formValidation(key, value, data, ignore, errorName);
    formErrors[key] = result[key] ?? "";
  });
  setData({ ...data, formErrors });
  return !values(formErrors).some((v) => notEqual(v, ""));
};

export const capitalizeCamelCase = (str) => {
  if (str) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

export const toImageList = (img) => {
  if (Array.isArray(img)) {
    return img
      .flat(Infinity)
      .filter((v) => typeof v === "string" && v.length > 0);
  }
  if (typeof img === "string" && img.length > 0) {
    return [img];
  }
  return [];
};

export const normalizeImageValue = (img) => {
  if (Array.isArray(img)) {
    const flat = img
      .flat(Infinity)
      .filter((v) => typeof v === "string" && v.length > 0);
    if (flat.length === 0) return "";
    if (flat.length === 1) return flat[0];
    return flat;
  }
  return typeof img === "string" ? img : "";
};

export const getImageUrl = (image) => {
  const flat = Array.isArray(image) ? image.flat(Infinity) : [image];
  const first = flat.find((v) => typeof v === "string" && v.length > 0);
  if (!first) return "";
  if (first.includes("http")) {
    return first;
  } else {
    return constants.baseUrl + first;
  }
};

/**
 * Format date to YYYY-MM-DD format
 * @param {Date} date - Date object to format
 * @returns {string|null} Formatted date string (YYYY-MM-DD) or null if date is invalid
 */
export const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
