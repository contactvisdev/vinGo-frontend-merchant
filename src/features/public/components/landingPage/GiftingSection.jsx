import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import gifting1 from "@/assets/images/gifting1.webp";
import gifting2 from "@/assets/images/gifting2.webp";
import gifting3 from "@/assets/images/gifting3.webp";

const CARDS = [
  {
    image: gifting1,
    title: "Beauty essentials from top brands",
    description:
      "Get all your beauty and self-care needs delivered at home or on-the-go",
    cta: "Get the App",
  },
  {
    image: gifting2,
    title: "Flowers for any occasion",
    description:
      "Shop hand-picked and thoughtfully-arranged blooms from florists near you.",
    cta: "Get the App",
  },
  {
    image: gifting3,
    title: "Party Essentials",
    description:
      "Hosting a get-together or need a special cocktail ingredient? Get liquor, beer, mixers, champagne and wine delivered fast.*",
    cta: "Get the App",
    note: "*Must be 21+. Enjoy responsibly.",
  },
];

const GiftingCard = ({ card }) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className="relative rounded-2xl overflow-hidden group min-h-[380px] flex flex-col justify-end">
      {/* Skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {/* Background image */}
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={handleLoad}
      />
      {/* Black fade from bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 space-y-3">
        <h3 className="text-lg font-bold text-white leading-snug">
          {card.title}
        </h3>
        <p className="text-sm text-white/80 leading-relaxed">
          {card.description}
        </p>
        {card.note && (
          <p className="text-xs text-white/60 italic">{card.note}</p>
        )}
        <button className="inline-flex bg-white rounded-full px-4 py-2 items-center gap-1.5 text-sm  text-primary transition-colors cursor-pointer bg-transparent border-none mt-1">
          {card.cta}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const GiftingSection = () => {
  return (
    <section className="bg-neutral-100 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-2xl lg:text-[46px] font-bold text-neutral-900 leading-tight">
            Helping you with to-dos
            <br />
            and gifting
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card, index) => (
            <GiftingCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftingSection;
