import React, { forwardRef } from "react";
import { Button } from "primereact/button";

const getButtonVariantClass = (variant = "primary") => {
  const variantClasses = {
    primary: "primary-btn",
    secondary: "secondary-btn",
    gray: "gray-btn border! border-neutral-600! bg-white!",
    line: "line-btn",
  };
  return variantClasses[variant] || variantClasses.primary;
};

const getButtonClasses = (fullWidth, className = "") => {
  const widthClass = fullWidth ? "w-full" : "w-auto";
  return (
    `flex items-center justify-center gap-2 ` +
    `px-3 sm:px-5 lg:px-8 2xl:px-[30px] ` +
    `h-11.5 ` +
    `text-sm sm:text-sm lg:text-base ` +
    `${widthClass} ${className}`
  );
};

const CustomButton = React.memo(forwardRef(
  (
    {
      label = "Button",
      icon,
      loading,
      onClick,
      className = "",
      extraClassName = "",
      type = "button",
      disabled,
      fullWidth = false,
      variant = "primary",
      fluid,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        type={type}
        className={`${getButtonVariantClass(variant)} ${getButtonClasses(fullWidth, className)} ${extraClassName} ${isDisabled ? "opacity-50 cursor-not-allowed grayscale-[40%]" : ""}`}
        label={label}
        icon={icon}
        loading={loading}
        onClick={onClick}
        disabled={isDisabled}
        {...props}
      />
    );
  },
));

CustomButton.displayName = "CustomButton";

export default CustomButton;
