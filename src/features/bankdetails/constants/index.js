/** Reserved for future table view; currently BankDetailsList uses card grid */
export const BANK_TABLE_COLUMNS = [
  { key: "bankName", label: "Bank Name", header: "Bank Name" },
  { key: "accountHolderName", label: "Account Holder", header: "Account Holder" },
  { key: "accountNumber", label: "Account Number", header: "Account Number" },
  { key: "ifscCode", label: "IFSC Code", header: "IFSC Code" },
  { key: "isPrimary", label: "Primary", header: "Primary" },
  { key: "action", label: "Action", header: "Action" },
];

/** Labels shown on BankCard per banking-group-specific field */
export const BANK_FIELD_DISPLAY_LABELS = {
  ifscCode: "IFSC Code",
  swiftCode: "SWIFT / BIC",
  iban: "IBAN",
  routingNumber: "Routing Number",
  transitNumber: "Transit Number",
  institutionNumber: "Institution Number",
  bsbCode: "BSB Code",
};
