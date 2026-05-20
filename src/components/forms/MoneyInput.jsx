import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { InputNumber } from "primereact/inputnumber";

export const MoneyInput = React.memo(forwardRef(
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
      disabled = false,
      min,
      max,
      currency = "USD",
      locale = "en-US",
      extraClassName,
      inputClass,
      ignoreLabel,
      ignoreError,
      ...props
    },
    ref,
  ) => {
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
        <InputNumber
          ref={ref}
          id={name}
          name={name}
          value={value ?? data?.[name] ?? null}
          onValueChange={(e) =>
            onChange && onChange({ name: e.target.name, value: e.value })
          }
          mode="currency"
          currency={currency}
          locale={locale}
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full"
          inputClassName={
            inputClass ||
            "w-full border border-neutral-400 rounded-md px-3 py-2 placeholder:text-neutral-600 h-11.5"
          }
          {...props}
        />
      </InputLayout>
    );
  },
));

MoneyInput.displayName = "MoneyInput";
