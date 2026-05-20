import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

import restaurantImg from "@/assets/images/RestaurantSection1.webp";
import IconButton from "@/components/ui/Button/IconButton";

const RestaurantSection = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch max-w-7xl mx-auto">
        {/* Left: Image — full bleed, edge-to-edge */}
        <div className="relative ">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          <img
            src={restaurantImg}
            alt="Woman enjoying food delivery from the VinGo app"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} lg:min-h-[600px]`}
            loading="lazy"
            onLoad={handleLoad}
          />
        </div>

        {/* Right: Content */}
        <div className="content-center px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
          <div className="space-y-5 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              Everything you crave, delivered.
            </h2>
            <p className="text-primary font-semibold text-base">
              Your favorite local restaurants
            </p>
            <p className="text-neutral-500 text-base leading-relaxed">
              Get a slice of pizza or the whole pie delivered, or pick up house
              lo mein from the Chinese takeout spot you've been meaning to try.
            </p>
            <IconButton
              label="Get the App"
              icon={ArrowRight}
              iconPos="right"
              className="primary-btn px-6 h-11 text-sm rounded-full!"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
