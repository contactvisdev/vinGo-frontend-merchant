import React, { forwardRef } from "react";

const VARIANT_CLASSES = {
  default: "text-gray-600 hover:bg-gray-100 hover:text-primary-600",
  danger: "text-gray-600 hover:bg-red-50 hover:text-red-600",
  success: "text-gray-600 hover:bg-green-100 hover:text-green-600",
};

const IconButton = React.memo(
  forwardRef(
    (
      {
        icon: Icon,
        onClick,
        disabled,
        ariaLabel,
        title,
        variant = "default",
        size = 18,
        className = "",
        loading,
        label = null,
      },
      ref,
    ) => {
      const isDisabled = disabled || loading;

      return (
        <button
          ref={ref}
          type="button"
          onClick={isDisabled ? undefined : onClick}
          disabled={isDisabled}
          aria-label={ariaLabel}
          title={title}
          className={`p-2 flex items-center gap-[4px] rounded-lg transition-colors ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.default} ${isDisabled ? "opacity-50 cursor-not-allowed!" : ""} ${className}`}
        >
          {label ? label : null} <Icon size={size} />
        </button>
      );
    },
  ),
);

IconButton.displayName = "IconButton";

export default IconButton;
