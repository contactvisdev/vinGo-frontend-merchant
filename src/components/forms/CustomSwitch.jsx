import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";

export const CustomSwitch = React.memo(forwardRef(
  (
    {
      name,
      data = {},
      value,
      onChange,
      label,
      required = false,
      disabled = false,
      col = 6,
      className = "",
      extraClassName = "",
      ignoreLabel,
      ignoreError,
      hideSwitchText = false,
      ...props
    },
    ref,
  ) => {
    const checked = value ?? data?.[name] ?? false;

    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      onChange &&
        onChange({
          name,
          value: !checked,
        });
    };

    return (
      <InputLayout
        col={col}
        name={name}
        label={label}
        required={required}
        extraClassName={extraClassName}
        ignoreLabel={ignoreLabel}
        ignoreError={ignoreError}
      >
        <label
          ref={ref}
          className={`flex items-center gap-3 cursor-pointer ${className}`}
        >
          <input
            type="checkbox"
            name={name}
            checked={checked}
            disabled={disabled}
            onChange={(e) =>
              onChange &&
              onChange({
                name: e.target.name,
                value: e.target.checked,
              })
            }
            className="hidden"
            {...props}
          />

          <div
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(e);
              }
            }}
            className={`
              w-11 h-6 rounded-full flex items-center px-1 transition-all duration-200
              ${
                checked
                  ? "bg-primary justify-end"
                  : "bg-gray-300 justify-start"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200" />
          </div>

          {!hideSwitchText && label && (
            <span className="text-sm select-none">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          )}
        </label>
      </InputLayout>
    );
  },
));

CustomSwitch.displayName = "CustomSwitch";
