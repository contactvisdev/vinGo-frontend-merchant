import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { useNavigate } from "react-router-dom";
import { getCheckboxClasses } from "./formInputUtils";

export const CustomCheckbox = React.memo(forwardRef(
  (
    {
      label,
      name,
      data,
      highlight,
      highlightColor = "#43ddc8",
      onHighlightClick,
      value,
      onChange,
      errorMessage,
      extraClassName,
      labelClassName,
      required,
      col,
      inputClass,
      template,
      standalone = false,
      ...props
    },
    ref,
  ) => {
    const checkboxError = errorMessage || data?.formErrors?.[name];
    const navigate = useNavigate();

    const inputEl = (
      <input
        ref={ref}
        type="checkbox"
        id={standalone ? undefined : name}
        name={name}
        checked={value ?? data?.[name] ?? false}
        onChange={(e) =>
          onChange &&
          onChange({
            ...e,
            name: e.target.name,
            value: e.target.checked,
          })
        }
        className={getCheckboxClasses(inputClass, !!checkboxError)}
        required={required}
        {...props}
      />
    );

    if (standalone) {
      return inputEl;
    }

    const renderLabel = () => {
      if (!label || !highlight || !label.includes(highlight)) {
        return label;
      }

      const parts = label.split(new RegExp(`(${highlight})`, "gi"));

      return parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <button
            type="button"
            key={`${part}-${index}`}
            className="font-semibold bg-transparent border-none p-0 cursor-pointer underline"
            style={{ color: highlightColor }}
            onClick={(e) => {
              e.preventDefault();
              if (onHighlightClick) {
                onHighlightClick();
              } else {
                navigate("/termsofservice");
              }
            }}
          >
            {part}
          </button>
        ) : (
          part
        ),
      );
    };

    return (
      <InputLayout
        col={col || 6}
        name=""
        extraClassName={extraClassName}
        errorMessage={checkboxError}
        checkbox={true}
      >
        <div className="flex items-center gap-2">
          {inputEl}

          {label && (
            <label
              htmlFor={name}
              className={`2xl:text-base lg:text-sm text-xs mt-1 cursor-pointer leading-none , ${
                labelClassName || ""
              }`}
            >
              {renderLabel()}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {template && <>{template}</>}
        </div>
      </InputLayout>
    );
  },
));

CustomCheckbox.displayName = "CustomCheckbox";
