import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import platform1 from "@/assets/images/platform1.webp";
import platform2 from "@/assets/images/platform2.svg";
import platform3 from "@/assets/images/platform3.webp";
import SkeletonImage from "@/components/ui/SkeletonImage";

const CARDS = [
  {
    icon: platform1,
    title: "Become a Driver",
    description:
      "Earn money on your schedule. Accept deliveries, track earnings, and work whenever you want with total flexibility.",
    cta: "Start Earning",
    href: "#driver",
  },
  {
    icon: platform2,
    title: "Become a Merchant",
    description:
      "Reach more customers, increase orders, and grow your business with powerful tools and real-time insights.",
    cta: "Join as Partner",
    href: "/login",
  },
  {
    icon: platform3,
    title: "Get the Best Delivery Experience",
    description:
      "Order food, groceries, and essentials from nearby stores — all in one easy-to-use app.",
    cta: "Get the App",
    href: "#home",
  },
];

const PlatformSection = () => {
  const navigate = useNavigate();

  const handleCta = (href) => {
    if (href.startsWith("#")) {
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <section id="about" className="bg-neutral-100 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 leading-tight">
            Join the Platform That Works for Everyone
          </h2>
          <p className="mt-4 text-neutral-500 text-base lg:text-lg">
            Join thousands who trust our platform to deliver convenience,
            income, and growth every day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col h-full p-8 text-center transition-shadow"
            >
              <div className="flex justify-center mb-6">
                <SkeletonImage
                  src={card.icon}
                  alt={card.title}
                  className="h-30 w-30 object-contain"
                  skeletonClassName="rounded-full"
                />
              </div>
              <div className="flex flex-col flex-1 justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                    {card.description}
                  </p>
                </div>
                <button
                  onClick={() => handleCta(card.href)}
                  className="inline-flex items-center gap-1.5  text-sm font-semibold text-primary hover:text-primary-600 transition-colors cursor-pointer bg-transparent border-none"
                >
                  {card.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
