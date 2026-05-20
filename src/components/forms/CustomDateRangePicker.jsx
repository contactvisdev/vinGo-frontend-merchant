import React, { forwardRef, useRef } from "react";
import InputLayout from "./InputLayout";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "primereact/calendar";

export const CustomDateRangePicker = React.memo(
  forwardRef(
    (
      {
        name = "dateRange",
        data = {},
        label,
        value,
        onChange,
        required = false,
        disabled = false,
        col = 12,
        extraClassName = "",
        ignoreLabel,
        ignoreError,
        dateFormat = "dd-mm-yy",
        minDateFrom,
        minDateTo,
        maxDateFrom,
        maxDateTo,
      },
      ref,
    ) => {
      const rangeValue = value ?? data?.[name] ?? { from: null, to: null };

      const handleChange = (key, date) => {
        if (!onChange) return;

        let nextValue = { ...rangeValue, [key]: date };

        if (key === "from" && date && rangeValue.to) {
          const fromDay = new Date(date);
          fromDay.setHours(0, 0, 0, 0);
          const toDay = new Date(rangeValue.to);
          toDay.setHours(0, 0, 0, 0);
          if (fromDay.getTime() > toDay.getTime()) {
            nextValue = { ...nextValue, to: null };
          }
        }

        if (key === "to" && date && rangeValue.from) {
          const toDay = new Date(date);
          toDay.setHours(0, 0, 0, 0);
          const fromDay = new Date(rangeValue.from);
          fromDay.setHours(0, 0, 0, 0);
          if (toDay.getTime() < fromDay.getTime()) {
            nextValue = { ...nextValue, from: null };
          }
        }

        onChange({
          name,
          value: nextValue,
        });
      };

      const endDateMin = rangeValue.from ?? minDateTo;
      const startDateMax = rangeValue.to ?? maxDateFrom;
      const fromCalendarRef = useRef(null);
      const toCalendarRef = useRef(null);

      const inputClass =
        "w-full border! border-neutral-300! rounded-[10px] px-4 pr-10 text-sm h-11.5!";

      const handleIconClick = (e, calendarRef) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        calendarRef.current?.show();
      };

      return (
        <InputLayout
          col={col}
          label={label}
          name={name}
          required={required}
          extraClassName={extraClassName}
          ignoreLabel={ignoreLabel}
          ignoreError={ignoreError}
        >
          <div ref={ref} className="flex items-center gap-4 w-full">
            <div className="relative flex-1 w-full">
              <Calendar
                ref={fromCalendarRef}
                id={`${name}_from`}
                value={rangeValue.from}
                onChange={(e) => handleChange("from", e.value)}
                dateFormat={dateFormat}
                disabled={disabled}
                placeholder="Start date"
                showIcon={false}
                className="w-full custom-date-picker rounded-[10px]!"
                appendTo={() => document.body}
                inputClassName={inputClass}
                minDate={minDateFrom}
                maxDate={startDateMax}
              />
              <button
                type="button"
                onClick={(e) => handleIconClick(e, fromCalendarRef)}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 flex items-center justify-center cursor-pointer hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Open calendar"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>

            <span className="text-gray-400 text-sm whitespace-nowrap">to</span>

            <div className="relative flex-1 w-full">
              <Calendar
                ref={toCalendarRef}
                value={rangeValue.to}
                onChange={(e) => handleChange("to", e.value)}
                dateFormat={dateFormat}
                disabled={disabled}
                placeholder="End date"
                showIcon={false}
                className="w-full rounded-[10px]!"
                inputClassName={inputClass}
                minDate={endDateMin}
                maxDate={maxDateTo}
              />
              <button
                type="button"
                onClick={(e) => handleIconClick(e, toCalendarRef)}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 flex items-center justify-center cursor-pointer hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                aria-label="Open calendar"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </InputLayout>
      );
    },
  ),
);

CustomDateRangePicker.displayName = "CustomDateRangePicker";
