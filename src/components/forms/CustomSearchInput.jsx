import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { InputText } from "primereact/inputtext";
import { Search } from "lucide-react";

export const CustomSearchInput = React.memo(
  forwardRef(
    (
      {
        name,
        data,
        label = "Search",
        value,
        onChange,
        placeholder = "Search...",
        className = "",
        inputClass = "",
        extraClassName = "",
        required = false,
        disabled = false,
        col = 12,
        ignoreLabel,
        ignoreError,
        ...props
      },
      ref,
    ) => {
      return (
        <InputLayout
          name={name}
          data={data}
          required={required}
          col={col}
          extraClassName={extraClassName}
          ignoreLabel={ignoreLabel}
          ignoreError={ignoreError}
        >
          <div className={`relative flex items-center min-h-11 ${className}`}>
            <InputText
              ref={ref}
              id={name}
              name={name}
              value={value ?? data?.[name] ?? ""}
              onChange={(e) =>
                onChange &&
                onChange({
                  name: e.target.name,
                  value: e.target.value,
                })
              }
              placeholder={placeholder}
              disabled={disabled}
              className={
                inputClass ||
                "w-full min-h-11 pl-10! pr-4 py-2 border border-neutral-300 rounded-[10px] h-11.5 placeholder:text-[#A1A1A1] placeholder:text-[14px]"
              }
              {...props}
            />

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 shrink-0 text-gray-400 pointer-events-none"
              aria-hidden
            />
          </div>
        </InputLayout>
      );
    },
  ),
);

CustomSearchInput.displayName = "CustomSearchInput";
