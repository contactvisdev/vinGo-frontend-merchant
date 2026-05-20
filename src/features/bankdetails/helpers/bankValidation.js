
// ─── IBAN country lengths (ISO 13616) ────────────────────────────────────────
export const IBAN_LENGTHS = {
  AL: 28, AD: 28, AT: 20, AZ: 28, BH: 22, BY: 28, BE: 16, BA: 20,
  BR: 29, BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28,
  EG: 29, SV: 28, EE: 20, FO: 18, FI: 18, FR: 27, GE: 22, DE: 22,
  GI: 23, GR: 27, GL: 18, GT: 28, HU: 28, IS: 26, IQ: 23, IE: 22,
  IL: 23, IT: 27, JO: 30, KZ: 20, XK: 20, KW: 30, LV: 21, LB: 28,
  LY: 25, LI: 21, LT: 20, LU: 20, MT: 31, MR: 27, MU: 30, MC: 27,
  MD: 24, ME: 22, NL: 18, MK: 19, NO: 15, PK: 24, PS: 29, PL: 28,
  PT: 25, QA: 29, RO: 24, LC: 32, SM: 27, ST: 25, SA: 24, RS: 22,
  SC: 31, SK: 24, SI: 19, ES: 24, SD: 18, SE: 24, CH: 21, TL: 23,
  TN: 24, TR: 26, UA: 29, AE: 23, GB: 22, VA: 22, VG: 24,
};

const IBAN_COUNTRY_SET = new Set(Object.keys(IBAN_LENGTHS));

// ─── Banking groups ──────────────────────────────────────────────────────────

export function getBankingGroup(countryCode) {
  if (!countryCode) return "default";
  const code = countryCode.toUpperCase();
  if (code === "IN") return "india";
  if (code === "US") return "us";
  if (code === "CA") return "canada";
  if (code === "AU") return "australia";
  if (IBAN_COUNTRY_SET.has(code)) return "iban";
  return "default";
}

// ─── Field configs per group ─────────────────────────────────────────────────

const FIELD_CONFIGS = {
  india: [
    { name: "accountNumber", label: "Account Number", placeholder: "1234567890123", required: true },
    { name: "ifscCode", label: "IFSC Code", placeholder: "HDFC0001234", required: true },
  ],
  iban: [
    { name: "iban", label: "IBAN", placeholder: "DE89370400440532013000", required: true },
    { name: "swiftCode", label: "SWIFT / BIC Code", placeholder: "COBADEFFXXX", required: false },
  ],
  us: [
    { name: "accountNumber", label: "Account Number", placeholder: "123456789012", required: true },
    { name: "routingNumber", label: "Routing Number", placeholder: "021000021", required: true },
  ],
  canada: [
    { name: "accountNumber", label: "Account Number", placeholder: "1234567", required: true },
    { name: "transitNumber", label: "Transit Number", placeholder: "12345", required: true },
    { name: "institutionNumber", label: "Institution Number", placeholder: "001", required: true },
  ],
  australia: [
    { name: "accountNumber", label: "Account Number", placeholder: "12345678", required: true },
    { name: "bsbCode", label: "BSB Code", placeholder: "062-000", required: true },
  ],
  default: [
    { name: "accountNumber", label: "Account Number", placeholder: "123456789012", required: true },
    { name: "swiftCode", label: "SWIFT / BIC Code", placeholder: "HDFCINBBXXX", required: false },
  ],
};

export function getFieldsForCountry(countryCode) {
  return FIELD_CONFIGS[getBankingGroup(countryCode)] || FIELD_CONFIGS.default;
}

export const ALL_BANK_FIELD_NAMES = [
  "accountNumber", "ifscCode", "swiftCode", "iban",
  "routingNumber", "transitNumber", "institutionNumber", "bsbCode",
];

export function validateIFSC(value) {
  if (!value) return "IFSC code is required";
  const v = value.toUpperCase().trim();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v))
    return "Invalid IFSC code (e.g. HDFC0001234)";
  return null;
}

export function validateSWIFT(value) {
  if (!value) return null; 
  const v = value.toUpperCase().trim();
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v))
    return "Invalid SWIFT/BIC code (8 or 11 characters)";
  return null;
}

export function validateIBAN(value) {
  if (!value) return "IBAN is required";
  const v = value.toUpperCase().replace(/\s/g, "");

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(v)) return "Invalid IBAN format";

  const countryCode = v.slice(0, 2);
  const expectedLen = IBAN_LENGTHS[countryCode];
  if (expectedLen && v.length !== expectedLen)
    return `IBAN for ${countryCode} must be ${expectedLen} characters`;
  if (!expectedLen && (v.length < 15 || v.length > 34))
    return "IBAN must be between 15 and 34 characters";

  const rearranged = v.slice(4) + v.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) =>
    (ch.charCodeAt(0) - 55).toString()
  );
  let remainder = numeric
    .match(/.{1,7}/g)
    .reduce((acc, chunk) => BigInt(acc + chunk) % 97n, 0n);
  if (remainder !== 1n) return "Invalid IBAN checksum";

  return null;
}

export function validateUSRouting(value) {
  if (!value) return "Routing number is required";
  const v = value.trim();
  if (!/^\d{9}$/.test(v)) return "Routing number must be 9 digits";
  const d = v.split("").map(Number);
  const sum =
    3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8]);
  if (sum % 10 !== 0) return "Invalid routing number checksum";
  return null;
}

export function validateCATransit(value) {
  if (!value) return "Transit number is required";
  if (!/^\d{5}$/.test(value.trim())) return "Transit number must be 5 digits";
  return null;
}

export function validateCAInstitution(value) {
  if (!value) return "Institution number is required";
  if (!/^\d{3}$/.test(value.trim()))
    return "Institution number must be 3 digits";
  return null;
}

export function validateBSB(value) {
  if (!value) return "BSB code is required";
  const v = value.trim().replace(/-/g, "");
  if (!/^\d{6}$/.test(v)) return "BSB code must be 6 digits (e.g. 062-000)";
  return null;
}

export function validateAccountNumber(value, countryCode) {
  if (!value) return "Account number is required";
  const v = value.trim();

  // Country-specific length rules
  const group = getBankingGroup(countryCode);
  if (group === "india") {
    if (!/^\d{9,18}$/.test(v))
      return "Account number must be 9–18 digits";
  } else if (group === "us") {
    if (!/^\d{4,17}$/.test(v))
      return "Account number must be 4–17 digits";
  } else if (group === "canada") {
    if (!/^\d{5,12}$/.test(v))
      return "Account number must be 5–12 digits";
  } else if (group === "australia") {
    if (!/^\d{6,10}$/.test(v))
      return "Account number must be 6–10 digits";
  } else {
    if (v.length < 5 || v.length > 34)
      return "Account number must be 5–34 characters";
  }
  return null;
}


const VALIDATORS = {
  ifscCode: (v) => validateIFSC(v),
  swiftCode: (v) => validateSWIFT(v),
  iban: (v) => validateIBAN(v),
  routingNumber: (v) => validateUSRouting(v),
  transitNumber: (v) => validateCATransit(v),
  institutionNumber: (v) => validateCAInstitution(v),
  bsbCode: (v) => validateBSB(v),
  accountNumber: (v, cc) => validateAccountNumber(v, cc),
};


export function validateBankField(fieldName, value, countryCode, required) {
  if (!required && !value?.trim()) return null;

  const validator = VALIDATORS[fieldName];
  if (validator) return validator(value, countryCode);

  if (required && !value?.trim()) return "This field is required";
  return null;
}
