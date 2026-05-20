import {
  FirstletterUpperCase,
  equal,
  greaterThan,
  length,
  notEqual,
  lessThan,
} from "./javascript";
import {
  stringValidation,
  emailValidation,
  regularString,
  number,
  passwordValidation,
  formatFieldName,
  officeNameRegex,
  addressRegex,
  zipCodeValidation,
  maxNumbers,
  stringNumberSpace,
  AllLettersUpercase,
  numberOnly,
  lettersWithSingleSpaces,
} from "./regex";
import { isValidPhoneNumber } from "react-phone-number-input";

const formValidation = (
  name,
  value,
  state,
  ignore = [],
  optional = [],
  errorName,
) => {
  const formErrors = { ...state.formErrors };
  if (ignore.includes(name)) {
    if (formErrors[name]) formErrors[name] = "";
    return formErrors;
  }

  switch (name) {
    case "email":
    case "businessEmail":
    case "officeEmail":
      if (equal(length(value)) && !optional.includes(name)) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (value && !emailValidation(value)) {
        formErrors[name] = `Please enter valid email!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "firstName":
    case "lastName":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!regularString(value)) {
        formErrors[name] = `Unnecessary space or special chracter in word!`;
      } else if (greaterThan(length(value), 35)) {
        formErrors[name] = `${formatFieldName(
          name,
        )} exceeds character limit. Maximum allowed: 35 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "serviceName":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (greaterThan(length(value), 35)) {
        formErrors[name] = `${formatFieldName(
          name,
        )} exceeds character limit. Maximum allowed: 35 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "officeName":
    case "officeLetterheadName":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      }  else if (greaterThan(length(value), 42)) {
        formErrors[name] = `${formatFieldName(
          name,
        )} exceeds character limit. Maximum allowed: 42 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "regulation":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "damageDescription":
    case "comment":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (greaterThan(length(value), 500)) {
        formErrors[name] = `${formatFieldName(
          name,
        )} exceeds character limit. Maximum allowed: 500 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "address":
    case "houseNo":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!addressRegex(value)) {
        formErrors[name] = `Please enter a valid address!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "fullName":
      if (equal(length(value)) && !optional.includes(name)) {
        formErrors[name] = `${errorName || formatFieldName(name)} is required`;
      } else if (value && !regularString(value)) {
        formErrors[name] = `Unnecessary space or special chracter in word!`;
      } else if (greaterThan(length(value), 70)) {
        formErrors[name] = `${
          errorName || formatFieldName(name)
        } exceeds character limit. Maximum allowed: 70 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "bic":
      if (equal(length(value)) && !optional.includes(name)) {
        formErrors[name] = `${
          errorName || AllLettersUpercase(name)
        } is required`;
      } else if (greaterThan(length(value), 70)) {
        formErrors[name] = `${
          errorName || AllLettersUpercase(name)
        } exceeds character limit. Maximum allowed: 70 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "role":
      if (!value || equal(length(value))) {
        formErrors[name] = "Role is required";
      } else {
        formErrors[name] = "";
      }
      break;

    case "tenantType":
    case "status":
    case "category":
    case "subCategory":
    case "selectRole":
    case "unitSize":
    case "name_id":
    case "bankAccount":
    case "landlordContact":
    case "damageCause":
    case "damageType":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!stringValidation(value)) {
        formErrors[name] = `Unnecessary space or special chracter in word!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "cost_type":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!stringNumberSpace(value)) {
        formErrors[name] = `Please enter a valid ${formatFieldName(name)}!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "loginPassword":
    case "staircaseAccess":
    case "buildingType":
    case "tenantId":
    case "dateOfBirth":
    case "date_of_birth":
    case "contractDate":
    case "addressBeforeMovingIn":
    case "unitType":
    case "location":
    case "waterHeating":
    case "heatingTechnology":
    case "landlordType":
    case "maturityType":
    case "unitHeadOne":
    case "whoHandle":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(errorName || name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "password":
    case "newPassword":
      if (equal(length(value))) {
        formErrors[name] = `${FirstletterUpperCase(name)} is required`;
      } else if (!passwordValidation(value)) {
        formErrors[name] =
          `Please enter a password with 8-16 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "iban":
      if (equal(length(value))) {
        formErrors[name] = `${AllLettersUpercase(name)} is required`;
      } else if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(value.replace(/\s/g, "").toUpperCase())) {
        formErrors[name] = `Please enter a valid ${AllLettersUpercase(name)}!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "landlord":
    case "property":
    case "oldPassword":
      if (equal(length(value))) {
        formErrors[name] = `${FirstletterUpperCase(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "confirmPassword":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (notEqual(state.password || state.newPassword, value)) {
        formErrors[name] = `${
          state.newPassword ? "New Password" : "Password"
        } and Confirm Password is not match!`;
      } else if (equal(state.password || state.newPassword, value)) {
        formErrors[name] = "";
      }
      break;

    case "qty":
    case "maximumOverride":
      if (!value && !optional.includes(name)) {
        if (name === "noOflabels") {
          formErrors[name] = `No of labels is required`;
        } else {
          formErrors[name] = `${formatFieldName(name)} is required`;
        }
      } else if (value && !number(value)) {
        if (name === "noOflabels") {
          formErrors[name] = `No of labels should be number!`;
        } else {
          formErrors[name] = `${formatFieldName(name)} should be number!`;
        }
      } else {
        formErrors[name] = "";
      }
      break;

    case "buildingMaxFloor":
      if (!value && !optional.includes(name)) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (value && !numberOnly(value)) {
        formErrors[name] = `Please enter valid ${formatFieldName(name)}!`;
      } else if (value && !maxNumbers(value)) {
        formErrors[name] = `Please enter valid ${formatFieldName(name)}!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "size":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!maxNumbers(value) || value == 0) {
        formErrors[name] = `Please enter valid ${formatFieldName(name)}!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "otpCode":
    case "mobileOtp":
      {
        if (!value) {
          formErrors[name] = `OTP is required`;
        } else if (value.length < 6) {
          formErrors[name] = `Valid OTP is required`;
        } else {
          formErrors[name] = "";
        }
      }
      break;

    case "phoneNumber":
    case "mobileNumber":
    case "mobile":
      {
        const phoneDigits = value ? value.replace(/\D/g, "") : "";
        if ((!value || phoneDigits.length <= 3) && !optional.includes(name)) {
          formErrors[name] = `${formatFieldName(name)} is required`;
        } else if (value && !isValidPhoneNumber(value)) {
          formErrors[name] = `Please enter valid ${formatFieldName(name)}`;
        } else {
          formErrors[name] = "";
        }
      }
      break;

    case "basePrice":
      {
        if (equal(length(value))) {
          formErrors[name] = `${formatFieldName(name)} is required`;
        } else if (value) {
          if (!number(value)) {
            formErrors[name] = `${formatFieldName(name)} should be number!`;
          } else if (Number(value) <= 0) {
            formErrors[name] =
              `${formatFieldName(name)} must be greater than 0`;
          } else {
            formErrors[name] = "";
          }
        }
      }
      break;

    case "ownerName":
    case "businessName":
      {
        if (equal(length(value)) || !value) {
          formErrors[name] = `${formatFieldName(name)} is required`;
        } else if (length(value) < 3) {
          formErrors[name] =
            `${formatFieldName(name)} must be at least 3 characters`;
        } else if (greaterThan(length(value), 50)) {
          formErrors[name] =
            `${formatFieldName(name)} should not exceed 50 characters.`;
        } else {
          formErrors[name] = "";
        }
      }
      break;

    case "businessLinkUrl": {
      if (value && value.trim()) {
        const urlPattern =
          /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;
        if (!urlPattern.test(value.trim())) {
          formErrors[name] = "Please enter a valid website URL";
        } else {
          formErrors[name] = "";
        }
      } else {
        formErrors[name] = "";
      }
      break;
    }

    case "startTime":
    case "complete_address":
      {
        if (equal(length(value)) || !value) {
          formErrors[name] = `${formatFieldName(name)} is required`;
        } else {
          formErrors[name] = "";
        }
      }
      break;

    case "furnitureProvided":
      if (!value) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    // case "documentsVerified":
    //   if (!value) {
    //     formErrors[name] = "Please confirm your documents are valid.";
    //   } else {
    //     formErrors[name] = "";
    //   }
    //   break;

    // case "termsAndConditions":
    //   if (!value) {
    //     formErrors[name] = "You must agree to the Terms & Conditions.";
    //   } else {
    //     formErrors[name] = "";
    //   }
    //   break;
    case "name":
      {
        if (!value || equal(length(value))) {
          formErrors[name] = `${formatFieldName(name)} is required`;
        } else if (greaterThan(length(value), 50)) {
          formErrors[name] =
            `${formatFieldName(name)} should not exceed 50 characters.`;
        }else {
          formErrors[name] = "";
        }
      }
      break;

    case "item_img": {
      const hasValue = Array.isArray(value)
        ? value.flat(Infinity).filter((v) => typeof v === "string" && v.length > 0).length > 0
        : typeof value === "string" && value.length > 0;
      if (!hasValue) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;
    }

    case "registrationCertificateUrl":
    case "businessDocumentUrl":
    case "idProofUrl":
    case "storeLogo":
    case "storePic":
    case "building_name":
    case "foodType":
    case "registrationNumber":
    case "taxIdentificationNumber": {
      if (!value) {
        formErrors[name] = `${formatFieldName(name)} is required`;
        break;
      }

      const trimmedVal = value.trim();

      if (trimmedVal.length === 0) {
        formErrors[name] = `${formatFieldName(
          name,
        )} cannot contain only spaces!`;
      } else if (value.includes("    ")) {
        formErrors[name] = `${formatFieldName(
          name,
        )} cannot contain four continuous spaces!`;
      } else {
        formErrors[name] = "";
      }
      break;
    }

    case "pincode": {
      if (!value) {
        formErrors[name] = `${formatFieldName(name)} is required`;
        break;
      }

      const trimmed = value.trim();

      if (trimmed.length === 0) {
        formErrors[name] = `${formatFieldName(
          name,
        )} cannot contain only spaces!`;
      } else {
        formErrors[name] = "";
      }
      break;
    }

    case "catalogName":
    case "promotionalCatalog":
    case "productTypeName":
      if (equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (greaterThan(length(value), 30)) {
        formErrors[name] =
          `${formatFieldName(name)} should not exceed 30 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "title":
      if (!value || equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!value.trim()) {
        formErrors[name] =
          `${formatFieldName(name)} cannot be empty or contain only spaces`;
      } else if (greaterThan(length(value), 100)) {
        formErrors[name] =
          `${formatFieldName(name)} should not exceed 100 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "description":
      if (!value || !value.trim()) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (greaterThan(length(value), 300)) {
        formErrors[name] =
          `${formatFieldName(name)} should not exceed 300 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

      case "brand":
     if (greaterThan(length(value), 25)) {
        formErrors[name] =
          `${formatFieldName(name)} should not exceed 25 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "stockQuantity":
      if (!value && value !== 0) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!number(value) || Number(value) < 0) {
        formErrors[name] = `${formatFieldName(name)} must be a valid positive number`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "expiryDate":
      if (!value) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        const expiry = new Date(value);
        if (isNaN(expiry.getTime())) {
          formErrors[name] = `${formatFieldName(name)} must be a valid date`;
        } else if (expiry <= new Date()) {
          formErrors[name] = `${formatFieldName(name)} must be a future date`;
        } else {
          formErrors[name] = "";
        }
      }
      break;

    case "promo_image":
      if (!value || (typeof value === "string" && !value.trim())) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (value && typeof value === "string" && value.trim()) {
        try {
          const url = new URL(value);
          if (!["http:", "https:"].includes(url.protocol)) {
            formErrors[name] =
              `${formatFieldName(name)} must be a valid HTTP or HTTPS URL`;
          } else {
            const imageExtensions = [
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".webp",
              ".svg",
            ];
            const hasImageExtension = imageExtensions.some((ext) =>
              url.pathname.toLowerCase().endsWith(ext),
            );
            if (!hasImageExtension && !url.pathname.includes(".")) {
              formErrors[name] = "";
            } else if (!hasImageExtension) {
              formErrors[name] =
                `${formatFieldName(name)} should be an image URL (jpg, png, gif, webp, svg)`;
            } else {
              formErrors[name] = "";
            }
          }
        } catch {
          formErrors[name] = `${formatFieldName(name)} must be a valid URL`;
        }
      } else {
        formErrors[name] = "";
      }
      break;

    case "maxDiscountAmount": {
      const strValue = value !== null && value !== undefined ? value.toString().trim() : "";
      if (!strValue) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!/^\d+(\.\d{1,2})?$/.test(strValue)) {
        formErrors[name] = `${formatFieldName(name)} must be a valid number (e.g., 10 or 10.50)`;
      } else {
        const numValue = Number(strValue);
        if (isNaN(numValue)) {
          formErrors[name] = `${formatFieldName(name)} must be a valid number`;
        } else if (numValue <= 0) {
          formErrors[name] = `${formatFieldName(name)} must be greater than 0`;
        } else if (greaterThan(numValue, 9999999)) {
          formErrors[name] = `${formatFieldName(name)} cannot exceed $9,999,999`;
        } else {
          formErrors[name] = "";
        }
      }
      break;
    }

    case "paymentMethods":
      if (!Array.isArray(value) || value.length === 0) {
        formErrors[name] = `${formatFieldName(name)} is required. Select at least one payment method`;
      } else {
        const invalidMethods = value.filter(
          (method) => typeof method !== "string" || !method.trim(),
        );
        if (greaterThan(invalidMethods.length, 0)) {
          formErrors[name] =
            `${formatFieldName(name)} contains invalid entries`;
        } else {
          const uniqueMethods = [...new Set(value)];
          if (greaterThan(value.length, uniqueMethods.length)) {
            formErrors[name] =
              `${formatFieldName(name)} contains duplicate entries`;
          } else {
            formErrors[name] = "";
          }
        }
      }
      break;

    case "combo_name":
      if (!value || equal(length(value))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!value.trim()) {
        formErrors[name] =
          `${formatFieldName(name)} cannot be empty or contain only spaces`;
      } else if (greaterThan(length(value), 100)) {
        formErrors[name] =
          `${formatFieldName(name)} should not exceed 100 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "quantity":
      if (!value || equal(length(String(value).trim()))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (greaterThan(length(value), 50)) {
        formErrors[name] = `${formatFieldName(name)} should not exceed 50 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "catalogId":
      if (!value || equal(length(String(value).trim()))) {
        formErrors[name] = `Please select a category`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "productTypeId":
      if (!value || equal(length(String(value).trim()))) {
        formErrors[name] = `Please select a product type`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "categoryId":
      if (!value || equal(length(String(value).trim()))) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "itemIds":
      if (!Array.isArray(value) || value.length === 0) {
        formErrors[name] = `Select at least one item for the combo`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "comboPrice": {
      const strValue =
        value !== null && value !== undefined ? value.toString().trim() : "";
      if (!strValue) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else if (!/^\d+(\.\d{1,2})?$/.test(strValue)) {
        formErrors[name] = `${formatFieldName(name)} must be a valid number (e.g., 10 or 10.50)`;
      } else {
        const numValue = Number(strValue);
        if (isNaN(numValue)) {
          formErrors[name] = `${formatFieldName(name)} must be a valid number`;
        } else if (numValue < 0) {
          formErrors[name] = `${formatFieldName(name)} cannot be negative`;
        } else if (greaterThan(numValue, 9999999)) {
          formErrors[name] = `${formatFieldName(name)} cannot exceed $9,999,999`;
        } else {
          formErrors[name] = "";
        }
      }
      break;
    }

    case "DiscountPercentage": {
      const strValue = value !== null && value !== undefined ? value.toString().trim() : "";
      if (!strValue) {
        formErrors[name] = `Discount is required`;
      } else if (!/^\d+(\.\d{1,2})?$/.test(strValue)) {
        formErrors[name] = `Discount must be a valid number`;
      } else {
        const numValue = Number(strValue);
        if (numValue <= 0) {
          formErrors[name] = `Discount must be greater than 0`;
        } else if (greaterThan(numValue, 100)) {
          formErrors[name] = `Discount cannot exceed 100%`;
        } else {
          formErrors[name] = "";
        }
      }
      break;
    }

    case "combo_image":
      if (!value || (typeof value === "string" && !value.trim())) {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "offer_details":
      if (!value || !value.trim()) {
        formErrors[name] = "At least one offer detail is required";
      } else {
        formErrors[name] = "";
      }
      break;

    case "startsOn": {
      if (value === null || value === undefined || value === "") {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        let dateValue;
        if (value instanceof Date) {
          dateValue = value;
        } else if (typeof value === "string" && value.trim()) {
          dateValue = new Date(value);
        } else {
          formErrors[name] = `${formatFieldName(name)} is required`;
          break;
        }

        if (isNaN(dateValue.getTime())) {
          formErrors[name] = `${formatFieldName(name)} must be a valid date`;
        } else if (state.expiresOn) {
          const expiresDate = new Date(state.expiresOn);
          if (!isNaN(expiresDate.getTime()) && !lessThan(dateValue.getTime(), expiresDate.getTime())) {
            formErrors[name] = `${formatFieldName(name)} must be before Expires On`;
          } else {
            formErrors[name] = "";
            // clear expiresOn cross-field error if it was about startsOn
            if (formErrors.expiresOn === "Expires On must be after Starts On") {
              formErrors.expiresOn = "";
            }
          }
        } else {
          formErrors[name] = "";
        }
      }
      break;
    }

    case "expiresOn":
      if (value === null || value === undefined || value === "") {
        formErrors[name] = `${formatFieldName(name)} is required`;
      } else {
        let dateValue;
        if (value instanceof Date) {
          dateValue = value;
        } else if (typeof value === "string" && value.trim()) {
          dateValue = new Date(value);
        } else {
          formErrors[name] = `${formatFieldName(name)} is required`;
          break;
        }

        if (isNaN(dateValue.getTime())) {
          formErrors[name] = `${formatFieldName(name)} must be a valid date`;
        } else {
          const now = new Date();
          if (lessThan(dateValue.getTime(), now.getTime())) {
            formErrors[name] = `${formatFieldName(name)} cannot be in the past`;
          } else if (state.startsOn) {
            const startsDate = new Date(state.startsOn);
            if (!isNaN(startsDate.getTime()) && !greaterThan(dateValue.getTime(), startsDate.getTime())) {
              formErrors[name] = `${formatFieldName(name)} must be after Starts On`;
            } else {
              const maxFutureDate = new Date();
              maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10);
              if (greaterThan(dateValue.getTime(), maxFutureDate.getTime())) {
                formErrors[name] =
                  `${formatFieldName(name)} cannot be more than 10 years in the future`;
              } else {
                formErrors[name] = "";
                // clear startsOn cross-field error if it was about expiresOn
                if (formErrors.startsOn === "Starts On must be before Expires On") {
                  formErrors.startsOn = "";
                }
              }
            }
          } else {
            const maxFutureDate = new Date();
            maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10);
            if (greaterThan(dateValue.getTime(), maxFutureDate.getTime())) {
              formErrors[name] =
                `${formatFieldName(name)} cannot be more than 10 years in the future`;
            } else {
              formErrors[name] = "";
            }
          }
        }
      }
      break;

    default:
      break;
  }

  return formErrors;
};

export default formValidation;
