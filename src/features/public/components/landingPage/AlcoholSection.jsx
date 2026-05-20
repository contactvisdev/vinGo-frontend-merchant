import { ArrowRight } from "lucide-react";

import alcoholImg from "@/assets/images/AlcoholSection.webp";
import SkeletonImage from "@/components/ui/SkeletonImage";
import IconButton from "@/components/ui/Button/IconButton";

const AlcoholSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto ">
        {/* Left: Full-bleed Image */}
        <div className="relative h-80 sm:h-96 lg:h-[600px]">
          <SkeletonImage
            src={alcoholImg}
            alt="Bartender with VinGo app showing beer and drink deals"
            className="w-full h-full object-cover"
            skeletonClassName="w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Right: Content */}
        <div className="space-y-5 px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24">
          <h2 className="text-2xl lg:text-[46px] font-bold lg:mt-0 mt-5 text-neutral-900 leading-tight">
            Skip the run. We'll bring the fun.
          </h2>
          <p className="text-primary font-semibold text-base">
            Your favorite drinks, delivered in under an hour.
          </p>
          <p className="text-neutral-500 text-base leading-relaxed max-w-md mb-12">
            From chilled beers and fine wines to premium spirits and mixers —
            order from home and get everything you need for the perfect night
            in, delivered straight to your door.
          </p>
          <IconButton
            label="Get the App"
            icon={ArrowRight}
            iconPos="right"
            className="primary-btn px-6 h-11 text-sm rounded-full! "
          />
        </div>
      </div>
    </section>
  );
};

export default AlcoholSection;
