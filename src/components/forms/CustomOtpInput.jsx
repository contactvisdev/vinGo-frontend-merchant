import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { InputOtp } from "primereact/inputotp";

export const CustomOtpInput = forwardRef(
  (
    {
      label,
      name,
      data = {},
      value,
      onChange,
      errorMessage,
      extraClassName = "",
      required = false,
      col = 12,
      ignoreLabel,
      disabled = false,
      length = 6,
      ...props
    },
    ref,
  ) => {
    const resolvedValue = value ?? data?.[name] ?? "";

    return (
      <InputLayout
        col={col}
        label={label}
        name={name}
        data={data}
        errorMessage={errorMessage}
        extraClassName={extraClassName}
        required={required}
        ignoreLabel={ignoreLabel}
      >
        <InputOtp
          ref={ref}
          value={resolvedValue}
          onChange={(e) => onChange && onChange({ name, value: e.value })}
          disabled={disabled}
          length={length}
          {...props}
        />
      </InputLayout>
    );
  },
);

CustomOtpInput.displayName = "CustomOtpInput";
