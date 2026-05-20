import heroImg from "@/assets/images/heroSection.webp";
import SkeletonImage from "@/components/ui/SkeletonImage";
import CustomButton from "@/components/ui/Button/Button";
import Qr from "../../../../assets/images/icons/Qr.png";

const landing = [
  { label: "10K+", dis: "Orders Delivered" },
  { label: "3K+", dis: "Happy Customers" },
  { label: "25+", dis: "Delivery Drivers" },
];
const HeroSection = () => {
  return (
    <section id="home" className="bg-primary overflow-hidden" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Everything You Need, Delivered To Your Doorstep
            </h1>

            <p className="text-base lg:text-lg text-white max-w-md">
              Order from top restaurants, shop fresh groceries, and get
              medicines delivered fast—all in one powerful app.
            </p>

            <div className="pt-2">
              <CustomButton
                label="Get the App"
                variant="gray"
                className="!text-primary !border-none !rounded-[26px]"
                aria-describedby="download-help"
              />

              <div className="mt-16">
                <p className="text-white">
                  Scan the QR code to download the app
                </p>

                <div className="mt-6">
                  <SkeletonImage
                    src={Qr}
                    alt="QR code to download the mobile app"
                    className="object-cover max-w-[100px]"
                    skeletonClassName="rounded-lg"
                    width={100}
                    height={100}
                  />
                </div>

                <div className="flex gap-[4%] mt-6" role="list">
                  {landing.map((t) => (
                    <div key={t.label} role="listitem">
                      <h2 className="text-[28px] text-white">{t.label}</h2>
                      <p className="text-white">{t.dis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hero image */}
          <div className="relative flex justify-center lg:justify-end">
            <SkeletonImage
              src={heroImg}
              alt="VinGo App showcasing restaurants, groceries, pharmacy and stores"
              className="w-full max-w-lg lg:max-w-xl object-contain"
              skeletonClassName="rounded-2xl"
              // width={660}
              // height={734}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
