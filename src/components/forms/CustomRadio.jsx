import React, { forwardRef } from "react";
import { getRadioColorClasses } from "./formInputUtils";

export const CustomRadio = React.memo(forwardRef(
  (
    {
      name,
      data,
      value,
      label,
      color = "green",
      onChange,
      className = "",
      ...props
    },
    ref,
  ) => {
    const selected = data?.[name] === value;
    const colors = getRadioColorClasses(color);

    return (
      <label
        ref={ref}
        className={`flex items-center gap-2 text-sm cursor-pointer ${className}`}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={selected}
          onChange={(e) =>
            onChange &&
            onChange({
              name,
              value: e.target.value,
            })
          }
          className="hidden peer"
          {...props}
        />

        {/* Outer Circle */}
        <div
          className={`relative w-4 h-4 rounded-full border-2 ${colors.border}`}
        >
          {/* Inner Dot */}
          {selected && (
            <div
              className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${colors.bg} -translate-x-1/2 -translate-y-1/2`}
            />
          )}
        </div>

        {label}
      </label>
    );
  },
));

CustomRadio.displayName = "CustomRadio";
