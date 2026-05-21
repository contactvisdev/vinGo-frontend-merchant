import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { InputText } from "primereact/inputtext";
import { getInputClasses, InputWrapper } from "./formInputUtils";

const CustomInput = React.memo(forwardRef(
  (
    {
      name,
      data,
      label,
      value,
      type = "text",
      className,
      onChange,
      extraClassName,
      inputClass = "",
      placeholder,
      icon,
      children,
      onClick,
      labelClassName = "",
      required = true,
      disabled = false,
      col = 12,
      ignoreLabel,
      ignoreError,
      maxLength,
      onlyPositiveNumber = false,
      currencySymbol,
      symbolPosition = "left",
      errorMessage,
      hasError: hasErrorProp,
      ...props
    },
    ref,
  ) => {
    const hasChildren = !!children;
    const hasError = hasErrorProp ?? !!(errorMessage || data?.formErrors?.[name]);

    const handleChange = (e) => {
      let val = e.target.value;

      if (onlyPositiveNumber) {
        val = val.replace(/[^0-9.]/g, "");

        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts.slice(1).join("");
        }
        if (Number(val) < 0) val = "";
      }

      if (maxLength) {
        val = val.toString().slice(0, maxLength);
      }

      onChange &&
        onChange({
          ...e,
          name,
          value: val,
        });
    };

    return (
      <InputLayout
        label={label}
        labelClassName={labelClassName}
        name={name}
        data={data}
        extraClassName={extraClassName}
        required={required}
        col={col}
        ignoreLabel={ignoreLabel}
        errorMessage={errorMessage}
        ignoreError={ignoreError}
      >
        {hasChildren ? (
          <div className={className}>{children}</div>
        ) : (
          <InputWrapper className={`relative ${className}`}>
            {/* Currency Symbol - left */}
            {currencySymbol && symbolPosition === "left" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                {currencySymbol}
              </span>
            )}

            <InputText
              ref={ref}
              className={`${getInputClasses(
                [
                  inputClass,
                  currencySymbol && symbolPosition === "left" && "pl-6!",
                  currencySymbol && symbolPosition === "right" && "pr-6!",
                ].filter(Boolean).join(" "),
                !!icon,
              )} ${hasError ? "border-error! p-invalid" : ""}`}
              id={name}
              name={name}
              onClick={onClick}
              value={value ?? data?.[name] ?? ""}
              type="text"
              inputMode={onlyPositiveNumber ? "decimal" : undefined}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onChange={handleChange}
              {...props}
            />

            {/* Currency Symbol - right */}
            {currencySymbol && symbolPosition === "right" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                {currencySymbol}
              </span>
            )}

            {icon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {icon}
              </div>
            )}
          </InputWrapper>
        )}
      </InputLayout>
    );
  },
));

CustomInput.displayName = "CustomInput";

export default CustomInput;
