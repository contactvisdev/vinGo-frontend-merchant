import React, { forwardRef, useMemo } from "react";
import InputLayout from "./InputLayout";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import ClipLoader from "react-spinners/ClipLoader";

export const CustomDropdown = React.memo(forwardRef(
  (
    {
      label,
      options = [],
      placeholder = "Select an option",
      value,
      onChange,
      optionLabel = "name",
      optionValue = "value",
      className = "",
      disabled = false,
      loading = false,
      col,
      name,
      required,
      extraClassName = "",
      data,
      errorMessage,
      ignoreLabel,
      ignoreError,
      layoutclass,
      hasError: hasErrorProp,
      maxHeight = "200px",
      ...rest
    },
    ref,
  ) => {
    const hasError = hasErrorProp ?? !!(errorMessage || data?.formErrors?.[name]);

    const pt = useMemo(() => ({
      wrapper: { style: { maxHeight, overflowY: 'auto' } },
      panel: {
        className: 'bg-neutral-50!',
        style: { boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-lg)', marginTop: '10px' },
      },
      item: ({ context }) => ({
        className: classNames('px-3.5! py-3!', {
          'bg-neutral-100! text-neutral-900!': context.focused || context.selected,
          'text-neutral-500!': !context.focused && !context.selected,
        }),
      }),
      emptyMessage: { className: 'px-3 py-2' },
    }), [maxHeight]);

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
        layoutclass={layoutclass}
      >
        <Dropdown
          ref={ref}
          id={name}
          value={value}
          onChange={onChange}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} lg:h-[45px] h-[42px] w-full border border-neutral-400 rounded-md flex items-center ${hasError ? "border-error! p-invalid" : ""}`}
          dropdownIcon={
            loading ? (
              <span className="flex items-center justify-center">
                <ClipLoader
                  size={16}
                  color="var(--color-primary)"
                  cssOverride={{ borderWidth: "2px" }}
                />
              </span>
            ) : (
              "pi pi-chevron-down"
            )
          }
          appendTo="self"
          pt={pt}
          {...rest}
        />
      </InputLayout>
    );
  },
));

CustomDropdown.displayName = "CustomDropdown";
