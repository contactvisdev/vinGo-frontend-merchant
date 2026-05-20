import React, { forwardRef } from "react";

export const CustomToggle = React.memo(forwardRef(
  ({ name, data, onChange, label, className = "", ...props }, ref) => {
    const checked = Boolean(data?.[name]);

    const handleToggleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onChange({
        name: name,
        value: !checked,
      });
    };

    return (
      <label
        ref={ref}
        className={`flex items-center gap-3 cursor-pointer ${className}`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => {
            onChange({
              name: e.target.name,
              value: e.target.checked,
            });
          }}
          className="hidden"
          {...props}
        />

        {/* Toggle Visual */}
        <div
          role="switch"
          aria-checked={checked}
          tabIndex={0}
          className={`w-11 h-6 rounded-full flex items-center px-1 transition-all duration-200 cursor-pointer
            ${checked ? "bg-primary justify-end" : "bg-gray-300 justify-start"}
          `}
          onClick={handleToggleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleClick(e);
            }
          }}
        >
          <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200" />
        </div>

        {label && <span className="text-sm">{label}</span>}
      </label>
    );
  },
));

CustomToggle.displayName = "CustomToggle";
