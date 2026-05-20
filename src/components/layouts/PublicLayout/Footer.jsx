import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/ui/Logo/Logo";
import playstor from "@/assets/images/icons/playstor.png";
import apple from "@/assets/images/icons/apple.png";
import SkeletonImage from "@/components/ui/SkeletonImage";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
];

const PRIVACY_POLICY_LINKS = [
  { label: "Customer Privacy Policy", href: "/privacy-policy/customer" },
  { label: "Merchant Privacy Policy", href: "/privacy-policy/merchant" },
  { label: "Driver Privacy Policy", href: "/privacy-policy/driver" },
];

const TERMS_CONDITIONS_LINKS = [
  { label: "Customer Terms & Conditions", href: "/terms-conditions/customer" },
  { label: "Merchant Terms & Conditions", href: "/terms-conditions/merchant" },
  { label: "Driver Terms & Conditions", href: "/terms-conditions/driver" },
];

const StoreBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg px-4 py-2 text-xs font-medium w-fit">
    {icon}
    {label}
  </div>
);

const AppleIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const PlayStoreIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M3.18 23.08c-.44-.27-.68-.72-.68-1.22V2.14c0-.5.24-.95.68-1.22l10.48 11.08L3.18 23.08zm14.54-8.84l-2.94-2.94 2.94-2.94 3.32 1.88c.59.33.59.87 0 1.21l-3.32 1.79zM4.84.72l10.5 10.5-2.94 2.94L4.84.72zm0 22.56l7.56-13.44 2.94 2.94L4.84 23.28z" />
  </svg>
);

const Footer = () => {
  const [brokenImages, setBrokenImages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (href) => {
    if (href === "#") return;
    
    const scrollToElement = () => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const navbarHeight = window.innerWidth >= 1024 ? 72 : 64;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToElement, 100);
    } else {
      scrollToElement();
    }
  };

  const handlePrivacyPolicyClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo className="h-10 w-auto object-contain" />
            <p className="text-[sm] text-neutral-400 leading-relaxed max-w-xs">
              Order from top restaurants, shop fresh groceries, and get
              medicines delivered fast all in one powerful app.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-white">
              Privacy Policy
            </h3>
            <ul className="space-y-2.5">
              {PRIVACY_POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={handlePrivacyPolicyClick}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-white">
              Terms & Conditions
            </h3>
            <ul className="space-y-2.5">
              {TERMS_CONDITIONS_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={handlePrivacyPolicyClick}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download */}
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-white">
              Download the App
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
                {brokenImages.playstore ? (
                  <StoreBadge icon={AppleIcon} label="App Store" />
                ) : (
                  <img
                    src={playstor}
                    alt="Download on the App Store"
                    className="h-10 w-auto"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, playstore: true }))
                    }
                  />
                )}
              </a>
              <a
                href="#"
                className="inline-block transition-transform hover:scale-105"
              >
                {brokenImages.googleplay ? (
                  <StoreBadge icon={PlayStoreIcon} label="Google Play" />
                ) : (
                  <img
                    src={apple}
                    alt="Get it on Google Play"
                    className="h-10 w-auto"
                    onError={() =>
                      setBrokenImages((prev) => ({
                        ...prev,
                        googleplay: true,
                      }))
                    }
                  />
                )}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#DADADA]">
            Copyright &copy;{new Date().getFullYear()} VinGo All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            {/* X / Twitter */}
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
