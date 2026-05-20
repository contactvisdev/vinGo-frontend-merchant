import React from "react";
import CustomButton from "@/components/ui/Button/Button";
import SkeletonImage from "@/components/ui/SkeletonImage";

/* --------------------------------------------------
   BASE CARD (Responsive)
--------------------------------------------------- */
const BaseCard = React.memo(function BaseCard({
  children,
  extraClassName = "",
  title,
  titleClass,
  description,
  btnLabel,
  linkIcon,
  linkLabel,
  btnClass = "",
  onClick,
  header,
  borderStyle = "border-neutral-400",
  paddingStyle = "p-4 sm:p-6 md:p-8 lg:p-10 ",
  titleFontStyle = "font-semibold text-lg sm:text-xl",
  additionalHeader,
}) {
  return (
    <div
      className={`
        bg-white
        rounded-[11px] 
        border ${borderStyle}
        ${paddingStyle}
        flex flex-col gap-4
        w-full
        ${extraClassName}
      `}
    >
      {header}

      {(title || description || btnLabel || linkIcon || linkLabel) && (
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Title + Description */}
          <div className="flex-1 min-w-[200px]">
            {title && (
              <p className={`text-black ${titleClass || titleFontStyle}`}>
                {title}
              </p>
            )}
            {description && (
              <span className="text-gray-400 text-sm sm:text-base">
                {description}
              </span>
            )}
          </div>

          {/* Button */}
          {btnLabel && (
            <CustomButton
              variant="primary"
              label={btnLabel}
              className={btnClass}
              onClick={onClick}
              fullWidth={false}
            />
          )}

          {/* Link button */}
          {(linkIcon || linkLabel) && (
            <button
              className="flex gap-3 items-center text-primary cursor-pointer bg-transparent border-none p-0"
              onClick={onClick}
            >
              {linkIcon && <SkeletonImage src={linkIcon} alt="icon" className="h-5" />}
              {linkLabel && <span className="text-base">{linkLabel}</span>}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
});

BaseCard.displayName = "BaseCard";

export default BaseCard;
