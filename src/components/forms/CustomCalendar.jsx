import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { Calendar } from "primereact/calendar";
import { getInputClasses } from "./formInputUtils";

const CustomCalendar = React.memo(
  forwardRef(
    (
      {
        name,
        data,
        label,
        value,
        className = "",
        onChange,
        extraClassName,
        labelClassName = "",
        required = true,
        disabled = false,
        col = 12,
        ignoreLabel,
        ignoreError,
        errorMessage,
        hasError: hasErrorProp,
        placeholder = "Select date",
        minDate,
        maxDate,
        showTime = false,
        hourFormat = "24",
        dateFormat = "yy-mm-dd",
        showIcon = true,
        ...props
      },
      ref,
    ) => {
      const finalError = errorMessage || data?.formErrors?.[name];
      const hasError = hasErrorProp ?? !!finalError;

      const resolvedValue = value ?? data?.[name] ?? null;
      const dateValue =
        resolvedValue && !(resolvedValue instanceof Date)
          ? new Date(resolvedValue)
          : resolvedValue;

      const handleChange = (e) => {
        onChange?.({ name, value: e.value });
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
          <Calendar
            ref={ref}
            id={name}
            name={name}
            value={dateValue}
            onChange={handleChange}
            showTime={showTime}
            hourFormat={hourFormat}
            dateFormat={dateFormat}
            showIcon={showIcon}
            disabled={disabled}
            placeholder={placeholder}
            minDate={minDate}
            maxDate={maxDate}
            invalid={hasError}
            className={`w-full ${className}`}
            inputClassName={`${getInputClasses("w-full", true)} ${hasError ? "border-primary!" : ""} !rounded-r-none`}
            appendTo={document.body}
            {...props}
          />
        </InputLayout>
      );
    },
  ),
);

CustomCalendar.displayName = "CustomCalendar";

export default CustomCalendar;
