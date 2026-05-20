import SkeletonImage from "@/components/ui/SkeletonImage";
import logoSrc from "@public/logo.png";

export default function Logo({ className, alt = "VinGo", ...props }) {
  return (
    <SkeletonImage
      src={logoSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
