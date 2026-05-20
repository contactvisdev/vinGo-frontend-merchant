import React from "react";
import InputLayout from "./InputLayout";
import { Password } from "primereact/password";

export const CustomPassword = React.memo(function CustomPassword({
  name,
  data,
  label,
  value,
  className,
  onChange,
  extraClassName,
  inputClass = "",
  placeholder,
  icon,
  children,
  onClick,
  labelClassName = "",
  required = true,
  disabled = false,
  col = 12,
  ignoreLabel,
  ignoreError,
  ...props
}) {
  const hasChildren = !!children;
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
      errorMessage={props.errorMessage}
      ignoreError={ignoreError}
    >
      {hasChildren ? (
        <div className={className}>{children}</div>
      ) : (
        <div className={`relative ${className || ""}`}>
          <Password
            toggleMask
            className={
              className
                ? className
                : `${inputClass}  h-11.5 w-full block border border-neutral-400 rounded-md px-3 py-2
                placeholder:text-neutral-600 ${icon ? "pr-10" : ""}`
            }
            inputClassName="block w-full"
            id={name}
            name={name}
            onClick={onClick}
            value={value ?? data?.[name] ?? ""}
            onChange={(e) =>
              onChange &&
              onChange({ ...e, name: e.target.name, value: e.target.value })
            }
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />

          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {icon}
            </div>
          )}
        </div>
      )}
    </InputLayout>
  );
});

CustomPassword.displayName = "CustomPassword";
