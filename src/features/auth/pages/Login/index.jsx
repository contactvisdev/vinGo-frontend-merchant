import { useState } from "react";
import { CustomPhoneInput } from "@/components/forms/CustomPhoneInput";
import { AuthCard } from "@/features/auth/components/Auth";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { useAuthApi } from "@features/auth/hooks";

const ROLE_OWNER = "owner";
const ROLE_STAFF = "staff";

const ROLES = [
  { value: ROLE_OWNER, label: "Owner" },
  { value: ROLE_STAFF, label: "Staff" },
];

export default function Login() {
  const { checkMerchantExists, loading } = useAuthApi();
  const [mobileData, setMobileData] = useState({
    mobileNumber: "",
    role: undefined,
    formErrors: {},
  });

  const handleMobileNumberChange = ({ name, value }) => {
    setMobileData((prev) => ({ ...prev, [name]: value, formErrors: { ...prev.formErrors, [name]: "" } }));
  };

  const handleRoleSelect = (role) => {
    const formErrors = formValidation("role", role, { ...mobileData, role });
    setMobileData((prev) => ({ ...prev, role, formErrors: { ...prev.formErrors, ...formErrors } }));
  };

  const handleContinueMobile = async (e) => {
    e.preventDefault();
    if (showFormErrors(mobileData, setMobileData, ["formErrors"])) {
      const payload = {
        phone: mobileData?.mobileNumber,
        role: mobileData?.role,
      };
      try {
        await checkMerchantExists(payload, (res) => {
          setMobileData({
            mobileNumber: "",
            role: mobileData?.role,
            formErrors: {},
          });
        });
      } catch {
        // Error handled by service layer
      }
    }
  };

  return (
    <>
      <div className="home-container w-full h-full">
        {/* -------- MAIN RESPONSIVE CONTENT -------- */}
        <div className="home-content overflow-hidden md:overflow-visible flex flex-col items-center justify-center gap-[50px] md:gap-[70px] xl:gap-[200px] 2xl:gap-[150px] lg:flex-row lg:items-center lg:justify-center md:px-10 lg:px-20">
          <img
            src="/images/bg-image.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="home-content__bg"
          />
          <div className="home-content__overlay" />
          {/* -------- LEFT SIDE TEXT -------- */}
          <p className="text-center md:text-center text-3xl md:text-[34px] lg:text-[40px] 2xl:text-[60px] lg:text-left font-bold leading-tight 2xl:pr-8">
            Grow Your Business
            <br /> with VinGo Platform
          </p>

          {/* -------- MOBILE NUMBER CARD -------- */}
          <AuthCard
            Head="Get Started"
            BtnLabel="Continue"
            onClick={handleContinueMobile}
            loading={loading}
          >
            <CustomPhoneInput
              label="Enter a mobile number"
              name="mobileNumber"
              data={mobileData}
              onChange={handleMobileNumberChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleContinueMobile(e);
                }
              }}
              country="aw"
            />
            <div className="w-full pt-1">
              <div
                role="group"
                aria-label="Select role"
                className="inline-flex gap-1 w-full p-1 rounded-xl bg-gray-100 border border-gray-200/80"
              >
                {ROLES.map((r) => {
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleRoleSelect(r.value)}
                      className={`
                        flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold
                        transition-all duration-200 ease-out
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 
                        ${
                          mobileData?.role === r.value
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-700 bg-gray-200/80 "
                        }
                      `}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
              {mobileData?.formErrors?.role && (
                <p className="text-primary text-xs mt-1.5 min-h-5">
                  {mobileData.formErrors.role}
                </p>
              )}
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
}
