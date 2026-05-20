import { ArrowRight } from "lucide-react";

import { useNavigate } from "react-router-dom";
import merchantImg from "@/assets/images/MerchantSection.png";
import SkeletonImage from "@/components/ui/SkeletonImage";
import IconButton from "@/components/ui/Button/IconButton";

const MerchantSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="merchant"
      className="bg-neutral-100 py-16 lg:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative flex justify-center lg:justify-start">
            <SkeletonImage
              src={merchantImg}
              alt="Laptop showing VinGo merchant dashboard with growth analytics"
              className="w-full max-w-2xl object-contain"
              skeletonClassName="rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-5">
            <h2 className="text-2xl lg:text-[46px] font-bold text-neutral-900 leading-tight">
              Grow your business with VinGo
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed max-w-md">
              Businesses large and small partner with VinGo to reach new customers,
              increase order volume, and drive more sales.
            </p>
            <IconButton
              label="Join as Partner"
              icon={ArrowRight}
              iconPos="right"
              onClick={() => navigate("/login")}
              className="primary-btn px-6 h-11 text-sm rounded-full!"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchantSection;
