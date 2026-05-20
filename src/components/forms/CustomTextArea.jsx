import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { InputTextarea } from "primereact/inputtextarea";

export const CustomTextArea = React.memo(forwardRef(
  (
    {
      name,
      data,
      label,
      value,
      onChange,
      placeholder,
      required = false,
      col = 12,
      rows = 4,
      disabled = false,
      extraClassName,
      inputClass,
      className,
      ignoreLabel,
      ignoreError,
      hasError: hasErrorProp,
      ...props
    },
    ref,
  ) => {
    const hasError = hasErrorProp ?? !!(data?.formErrors?.[name]);

    return (
      <InputLayout
        col={col}
        label={label}
        name={name}
        data={data}
        required={required}
        extraClassName={extraClassName}
        ignoreLabel={ignoreLabel}
        ignoreError={ignoreError}
      >
        <InputTextarea
          ref={ref}
          id={name}
          name={name}
          value={value ?? data?.[name] ?? ""}
          onChange={(e) =>
            onChange && onChange({ name: e.target.name, value: e.target.value })
          }
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={
            `${inputClass || "w-full border rounded-md px-3 py-2 placeholder:text-neutral-600 resize-none"} ${hasError ? "border-primary! p-invalid" : "border-neutral-400"} ${className || ""}`
          }
          {...props}
        />
      </InputLayout>
    );
  },
));

CustomTextArea.displayName = "CustomTextArea";
