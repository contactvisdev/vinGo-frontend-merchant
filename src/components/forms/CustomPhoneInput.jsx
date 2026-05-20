import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { capitalizeCamelCase } from "@/helpers/commonFunctions";

export const CustomPhoneInput = React.memo(forwardRef((props, ref) => {
  const {
    label,
    name,
    data = {},
    value,
    onChange,
    onKeyDown,
    errorMessage,
    extraClassName = "",
    required = false,
    col = 6,
    inputClass = "",
    disabled = false,
    readOnly = false,
    placeholder = "",
    ignoreLabel,
    ignoreError,
    country = "UA",
  } = props;

  const isLocked = disabled || readOnly;

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={`m-0 ${extraClassName}`}
      data={data}
      errorMessage={errorMessage}
      ignoreLabel={ignoreLabel}
      ignoreError={ignoreError}
    >
      <PhoneInput
        ref={ref}
        inputProps={{ id: name }}
        defaultCountry={country?.toLowerCase()}
        value={value ?? data[name] ?? ""}
        onChange={(val) => {
          if (isLocked) return;
          onChange && onChange({ name, value: val ?? "" });
        }}
        onKeyDown={onKeyDown}
        disabled={isLocked}
        placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
        className={`w-full phoneinput  ${isLocked ? "opacity-60" : ""}`}
        inputClassName={`w-full outline-none! text-base    ${inputClass}`}
      />
    </InputLayout>
  );
}));

CustomPhoneInput.displayName = "CustomPhoneInput";
