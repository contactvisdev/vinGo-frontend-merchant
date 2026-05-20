import { forwardRef } from "react";

export const getInputClasses = (inputClass = "", hasIcon = false) => {
  const base = `h-11.5 w-full border border-neutral-400 rounded-md px-3 py-2 placeholder:text-neutral-600 ${hasIcon ? "pr-10" : ""}`;
  const extra = inputClass?.trim();
  return extra ? `${base} ${extra}` : base;
};

export const getPhoneInputClasses = () => ({
  container: "w-full flex items-center",
  input: `
    flex-1 px-3 text-base border! border-neutral-400! shadow-none
    w-full rounded-md! h-11.5!
  `,
  dropdown: `
    p-2 bg-white rounded-lg shadow-lg
    max-h-80 overflow-y-auto z-50
  `,
});

export const getTimeInputClasses = (className = "", inputClass = "") => {
  return (
    className ||
    inputClass ||
    "w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  );
};

export const getCheckboxClasses = (inputClass = "", hasError = false) => {
  const base =
    "w-6 h-6 min-w-[24px] min-h-[24px] rounded-[5px] border border-gray-300 bg-[#FDFDFD] flex-shrink-0 cursor-pointer appearance-none opacity-100 disabled:opacity-50 disabled:cursor-not-allowed relative checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]";
  const error = hasError ? "border-red-500" : "";
  const before =
    "before:content-[''] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] before:bg-no-repeat before:bg-center before:bg-[length:14px_14px] before:opacity-0 checked:before:opacity-100";
  const extra = inputClass?.trim() || "";
  return `${base} ${error} ${before} ${extra}`.trim();
};

export const getRadioColorClasses = (color = "green") => {
  const colorMap = {
    green: { border: "border-success", bg: "bg-success" },
    red: { border: "border-error", bg: "bg-error" },
    pink: { border: "border-primary-600", bg: "bg-primary-600" },
    gray: { border: "border-neutral-600", bg: "bg-neutral-600" },
  };
  return colorMap[color] || colorMap.green;
};

export const parseTime = (timeStr) => {
  if (!timeStr) return { hours: "", minutes: "" };
  const [hours, minutes] = timeStr.split(":");
  return { hours, minutes };
};

export const InputWrapper = forwardRef(({ children, className = "" }, ref) => (
  <div ref={ref} className={`relative ${className}`}>
    {children}
  </div>
));

InputWrapper.displayName = "InputWrapper";
