import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomButton from "@/components/ui/Button/Button";
import ProgressBar from "./shared/ProgressBar";
import { useOnboardingHydration } from "../hooks";
import { selectCurrentStep } from "../store/onboardingSlice";

export default function OnboardingPage({
  step,
  BackTo,
  NextTo,
  head,
  headClass,
  subHead,
  submitButtonLabel,
  children,
  nextbtn = true,
  btnclass,
  disabled = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = useSelector(selectCurrentStep);
  useOnboardingHydration(location?.state?.merchantId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [currentStep]);

  const handleNext = () => NextTo?.();
  const handleBack = () => {
    if (typeof BackTo === "function") BackTo();
    else navigate(BackTo);
  };

  return (
    <div className="px-5 2xl:px-0 flex flex-col items-center justify-center w-full  max-w-[1368px] mx-auto ">
      <div className="flex flex-col items-center justify-center gap-[50px] w-full my-10  ">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2 text-left" onClick={handleBack}>
            <i
              className="pi pi-chevron-left cursor-pointer"
              style={{ fontSize: "24px" }}
            />
            <p className="cursor-pointer  2xl:text-base lg:text-sm text-xs">
              Back
            </p>
          </div>
        </div>

        <ProgressBar currentStep={step} />

        <div className="text-center w-full">
          <span
            className={`2xl:text-[40px] lg:text-3xl text-[20px] ${headClass} font-medium`}
          >
            {head}
          </span>
          <p className="text-base text-neutral-700">{subHead}</p>
        </div>

        <div className="w-full flex flex-col gap-6">{children}</div>

        {nextbtn && (
          <CustomButton
            variant="primary"
            label={submitButtonLabel || "Next"}
            fullWidth={false}
            onClick={handleNext}
            disabled={disabled}
            className={`2xl:px-[150px] xl:px-[120px] lg:px-[100px]  px-20 ${btnclass}`}
          />
        )}
      </div>
    </div>
  );
}
