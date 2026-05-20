import { Fragment } from "react";
import { useCategory } from "@hooks/api";
import { getRegistrationSteps } from "@/helpers/constants/categories";

export default function ProgressBar({ currentStep }) {
  const iconStyle = { fontSize: "10px", color: "white" };
  const { categoryName } = useCategory();
  const steps = getRegistrationSteps(categoryName);

  return (
    <div className="w-full flex justify-center progressbar">
      <div className="max-w-[900px] lg:flex lg:items-center gap-4">
        {steps.map((label, index) => {
          const isCompleted = currentStep > index + 1;
          const isActive = currentStep === index + 1;

          return (
            <Fragment key={index}>
              {/* Step */}
              <div className="flex items-center gap-3">
                <i
                  className={`pi ${
                    isCompleted ? "pi-check" : "pi-circle-on"
                  } rounded-full p-2.5 ${
                    isCompleted || isActive ? "bg-primary" : "bg-gray-300"
                  }`}
                  style={iconStyle}
                />

                <p
                  className={`font-medium text-xs whitespace-nowrap ${
                    isActive || isCompleted
                      ? "text-primary"
                      : "text-neutral-700"
                  }`}
                >
                  {label}
                </p>
              </div>

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`hidden lg:block step-line ${
                    currentStep > index + 1 ? "completed" : ""
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
