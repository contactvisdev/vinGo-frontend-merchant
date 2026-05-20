import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { ChevronDown, Menu, X, Globe } from "lucide-react";
import Logo from "@/components/ui/Logo/Logo";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
];

const JOIN_OPTIONS = [
  { label: "Restaurant", href: "/login" },
  { label: "Grocery", href: "/login" },
  { label: "Pharmacy", href: "/login" },
  { label: "Liquor", href: "/login" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDropdownOpen, setJoinDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const blurTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(blurTimerRef.current), []);

  const handleScrollTo = useCallback(
    (href) => {
      setMobileMenuOpen(false);
      setJoinDropdownOpen(false);

      const scrollToElement = () => {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const navbarHeight = window.innerWidth >= 1024 ? 72 : 64;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      };

      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(scrollToElement, 100);
      } else {
        scrollToElement();
      }
    },
    [navigate, location],
  );

  const handleGetStarted = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Logo
            className="h-10 lg:h-14 w-auto object-contain cursor-pointer"
            onClick={() => handleScrollTo("#home")}
          />

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScrollTo(link.href)}
                className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}

            {/* Join Us As dropdown */}
            <div className="relative">
              <button
                onClick={() => setJoinDropdownOpen((prev) => !prev)}
                onBlur={() => {
                  clearTimeout(blurTimerRef.current);
                  blurTimerRef.current = setTimeout(
                    () => setJoinDropdownOpen(false),
                    150,
                  );
                }}
                className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
              >
                Join Us As
                <ChevronDown
                  size={16}
                  className={`transition-transform ${joinDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {joinDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
                  {JOIN_OPTIONS.map((opt, idx) => (
                    <div key={opt.label}>
                      <button
                        onClick={() => {
                          setJoinDropdownOpen(false);
                          navigate(opt.href);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
                      >
                        {opt.label}
                      </button>
                      {idx < JOIN_OPTIONS.length - 1 && (
                        <div className="h-px bg-neutral-100 mx-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: language + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language selector */}
            <button
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              onBlur={() => {
                clearTimeout(blurTimerRef.current);
                blurTimerRef.current = setTimeout(
                  () => setLangDropdownOpen(false),
                  150,
                );
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              <Globe size={18} />
              EN
              <ChevronDown
                size={16}
                className={`transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Get Started button */}
            <button
              onClick={handleGetStarted}
              className="primary-btn px-6 h-10 text-sm rounded-full! font-medium cursor-pointer border-none"
              aria-label="Get started with the application"
              type="button"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-neutral-700 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScrollTo(link.href)}
              className="block w-full text-left text-sm font-medium text-neutral-700 py-2 bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-neutral-200 pt-3">
            <p className="text-xs text-neutral-500 mb-2">Join Us As</p>
            {JOIN_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(opt.href);
                }}
                className="block w-full text-left text-sm text-neutral-700 py-2 bg-transparent border-none cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button
            label="Get Started"
            onClick={handleGetStarted}
            className="primary-btn w-full h-10 text-sm rounded-full!"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
