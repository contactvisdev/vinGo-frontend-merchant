import React, { forwardRef } from "react";
import InputLayout from "./InputLayout";
import { Clock } from "lucide-react";
import { parseTime, getTimeInputClasses } from "./formInputUtils";

export const CustomTimeInput = React.memo(forwardRef(
  (
    {
      name,
      data,
      label,
      value,
      onChange,
      placeholder,
      ignoreLabel,
      required = true,
      disabled = false,
      col = 12,
      className,
      inputClass = "",
      icon = true,
      ...props
    },
    ref,
  ) => {
    const { hours, minutes } = parseTime(value);
    const timeClasses = getTimeInputClasses(className, inputClass);

    return (
      <InputLayout
        label={label}
        name={name}
        data={data}
        required={required}
        col={col}
        ignoreLabel={ignoreLabel}
      >
        <div ref={ref} className="relative w-full flex gap-1 items-center">
          {/* Hours */}
          <div className="relative w-1/2">
            <input
              type="number"
              min={0}
              max={23}
              value={hours}
              disabled={disabled}
              placeholder="HH"
              className={timeClasses}
              onChange={(e) => {
                const newHours = e.target.value;
                const newTime = `${newHours}:${minutes ?? "00"}`;
                onChange && onChange({ name, value: newTime });
              }}
              {...props}
            />
            {icon && (
              <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            )}
          </div>

          <span className="text-gray-500">:</span>

          {/* Minutes */}
          <div className="relative w-1/2">
            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              disabled={disabled}
              placeholder="MM"
              className={timeClasses}
              onChange={(e) => {
                const newMinutes = e.target.value;
                const newTime = `${hours ?? "00"}:${newMinutes}`;
                onChange && onChange({ name, value: newTime });
              }}
              {...props}
            />
            {icon && (
              <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            )}
          </div>
        </div>
      </InputLayout>
    );
  },
));

CustomTimeInput.displayName = "CustomTimeInput";
