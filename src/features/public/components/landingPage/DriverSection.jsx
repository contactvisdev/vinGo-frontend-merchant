import { ArrowRight } from "lucide-react";

import driverImg from "@/assets/images/DriverSection.webp";
import SkeletonImage from "@/components/ui/SkeletonImage";
import IconButton from "@/components/ui/Button/IconButton";

const DriverSection = () => {
  return (
    <section id="driver" className="bg-neutral-50 overflow-hidden ">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
        {/* Left: Content */}
        <div className="space-y-5 px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-24 order-2 lg:order-1">
          <h2 className="text-2xl lg:text-[46px] font-bold text-neutral-900 leading-tight lg:mt-0 mt-5">
            Sign up to VinGo and get paid
          </h2>
          <p className="text-neutral-500 text-base leading-relaxed max-w-md">
            Deliver with the #1 Food and Drink App in the U.S. As a delivery
            driver, you'll make money and work on your schedule. Sign up in
            minutes.
          </p>
          <IconButton
            label="Get the App"
            icon={ArrowRight}
            iconPos="right"
            className="primary-btn px-6 h-11 text-sm rounded-full!"
          />
        </div>

        {/* Right: Full-bleed Image */}
        <div className="relative h-80 sm:h-96 lg:h-[591px] order-1 lg:order-2">
          <SkeletonImage
            src={driverImg}
            alt="VinGo delivery driver with phone showing route and delivery bag"
            className="w-full h-full object-cover"
            skeletonClassName="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default DriverSection;
