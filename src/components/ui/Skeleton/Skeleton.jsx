import React from "react";

const Skeleton = React.memo(function Skeleton({ className = "", variant = "text" }) {
  const baseClasses = "animate-pulse bg-gray-200";
  
  const variantClasses = {
    text: "h-4 rounded",
    heading: "h-6 rounded",
    paragraph: "h-3 rounded mb-2",
    avatar: "rounded-full",
    image: "rounded-lg",
    button: "h-11.5 rounded-md",
    card: "rounded-xl",
    metric: "h-20 rounded-xl",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <div className={classes} />;
});

Skeleton.displayName = "Skeleton";

const SkeletonLoader = React.memo(function SkeletonLoader({ count = 1, variant = "metric", className = "" }) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton key={index} variant={variant} className={className} />
  ));

  return <>{skeletons}</>;
});

SkeletonLoader.displayName = "SkeletonLoader";

export { Skeleton, SkeletonLoader };