import React, { forwardRef } from "react";

export const CustomForm = forwardRef(
  (
    {
      children,
      title,
      header,
      col,
      extraClassName,
      titleCol,
      formClass,
      ...props
    },
    ref,
  ) => {
    return (
      <form
        ref={ref}
        className={`${formClass} grid m-0 p-0 justify-content-between overflow-hidden w-full`}
        {...props}
      >
        {title && (
          <div
            className={`px-0 col-${titleCol || "10"} title my-auto ${
              extraClassName || ""
            }`}
          >
            {title}
          </div>
        )}
        {header && (
          <div className={`col-${col || "2"} title my-auto`}>{header}</div>
        )}
        {children}
      </form>
    );
  },
);

CustomForm.displayName = "CustomForm";
