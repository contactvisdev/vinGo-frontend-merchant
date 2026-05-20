import React from "react";

const PageHeader = React.memo(({ title, subtitle }) => {
  return (
    <div className="px-8 pt-6">
      {title && <h1 className="text-3xl font-medium text-black">{title}</h1>}
      {subtitle && <p className="text-base mt-1">{subtitle}</p>}
    </div>
  );
});

PageHeader.displayName = "PageHeader";

export default PageHeader;
