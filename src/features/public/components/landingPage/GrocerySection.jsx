import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

import groceryImg from "@/assets/images/GrocerySection.webp";
import IconButton from "@/components/ui/Button/IconButton";

const GrocerySection = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <section className="relative overflow-hidden">
      {/* Background image with pink gradient overlay */}
      <div className="absolute inset-0">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={groceryImg}
          alt=""
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-400/85 to-pink-400/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <h2 className=" text-2xl lg:text-[46px] font-bold text-white leading-tight max-w-2xl mx-auto">
          Fresh groceries and home essentials, at your door in minutes.
        </h2>
        <p className="mt-4 text-white/90 font-semibold text-base">
          Grocery delivery, exactly how you want it.
        </p>
        <p className="mt-3 text-white/75 text-sm max-w-xl mx-auto leading-relaxed">
          Shop from home and fill your cart with fresh produce, frozen entrees,
          deli delights and more.
        </p>
        <div className="mt-8 justify-items-center">
          <IconButton
            label="Shop Groceries"
            icon={ArrowRight}
            iconPos="right"
            className="bg-white! text-primary! border-none! px-8 h-11 text-sm font-semibold rounded-full! hover:bg-neutral-100! transition-colors"
          />
        </div>
      </div>
    </section>
  );
};

export default GrocerySection;
