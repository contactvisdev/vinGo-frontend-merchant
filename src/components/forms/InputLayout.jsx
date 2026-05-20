import React from "react";

const InputLayout = React.memo(function InputLayout({
  label,
  name,
  required,
  col = 12,
  extraClassName = "",
  errorMessage,
  data,
  children,
  ignoreLabel = false,
  labelClassName = "",
  ignoreError = false,
  checkbox = false,
  layoutclass = "",
}) {
  const finalError = errorMessage || data?.formErrors?.[name];

  return (
    <div
      className={`flex flex-col w-full col-span-${col || 12} ${extraClassName}`}
    >
      {/* LABEL */}
      {!ignoreLabel && (
        <label
          htmlFor={name}
          className={`2xl:text-base lg:text-sm text-xs text-neutral-900 text-left mt-0 custom-label ${labelClassName}`}
        >
          {label || name}
          {required && <span className="text-primary">*</span>}
        </label>
      )}

      {/* INPUT */}
      {children}

      {/* ERROR MESSAGE (WAY-1 FIX → always reserve space) */}
      {!ignoreError && finalError ? (
        <small
          className={`text-primary min-h-5 2xl:text-sm lg:text-xs text-[10px] ${checkbox && "ml-5"}`}
          id="error-element"
        >
          {finalError && <span>{finalError}</span>}
        </small>
      ) : (
        // <span className={`p-2.5 ${layoutclass}`}></span><>
        <></>
      )}
    </div>
  );
});

InputLayout.displayName = "InputLayout";

export default InputLayout;
