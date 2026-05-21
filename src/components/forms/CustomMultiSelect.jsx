import React, { forwardRef, useMemo } from "react";
import InputLayout from "./InputLayout";
import { getInputClasses } from "./formInputUtils";
import { MultiSelect } from "primereact/multiselect";
import { classNames } from "primereact/utils";

export const CustomMultiSelect = React.memo(forwardRef(
  (
    {
      label,
      options = [],
      placeholder = "Select",
      value,
      onChange,
      optionLabel = "name",
      optionValue = "value",
      className = "",
      disabled = false,
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
      display = "chip",
      filter = false,
      itemTemplate,
      selectedItemTemplate,
      ...rest
    },
    ref,
  ) => {
    const hasError = hasErrorProp ?? !!(errorMessage || data?.formErrors?.[name]);

    const pt = useMemo(() => ({
      wrapper: { style: { maxHeight, overflowY: 'auto' } },
      panel: { style: { color: '#000' } },
      token: { className: 'bg-primary! text-white! px-2! py-1! relative z-[1]' },
      removeTokenIcon: { className: 'text-white!' },
      header: { className: 'px-3! py-2!' },
      item: ({ context }) => ({
        className: classNames('px-3! py-2!', {
          'text-primary-700! bg-primary-50!': context.selected,
          'bg-primary-100!': context.selected && context.focused,
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
        <MultiSelect
          ref={ref}
          id={name}
          value={value}
          onChange={onChange}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={placeholder}
          disabled={disabled}
          display={display}
          filter={filter}
          appendTo="self"
          itemTemplate={itemTemplate}
          selectedItemTemplate={selectedItemTemplate}
          pt={pt}
          className={`${className} ${getInputClasses("w-full min-h-[42px] flex items-center", false)} ${hasError ? "border-error! p-invalid" : ""}`}
          {...rest}
        />
      </InputLayout>
    );
  },
));

CustomMultiSelect.displayName = "CustomMultiSelect";
