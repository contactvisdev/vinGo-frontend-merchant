import { ArrowRight } from "lucide-react";

import pharmacyImg from "@/assets/images/PharmacySection.webp";
import SkeletonImage from "@/components/ui/SkeletonImage";
import IconButton from "@/components/ui/Button/IconButton";

const PharmacySection = () => {
  return (
    <section className="bg-neutral-100 py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-5 order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              Pharmacy essentials at your doorstep
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed max-w-md">
              Stock up on medicines, vitamins, health supplements, or personal
              care — all delivered in under an hour.
            </p>
            <IconButton
              label="Order Now"
              icon={ArrowRight}
              iconPos="right"
              className="primary-btn px-6 h-11 text-sm rounded-full!"
            />
          </div>

          {/* Right: Image */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <SkeletonImage
              src={pharmacyImg}
              alt="VinGo pharmacy app showing personal care, hair care, and pharmacy categories"
              className="w-full h-full max-w-xl object-contain"
              skeletonClassName="rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PharmacySection;
