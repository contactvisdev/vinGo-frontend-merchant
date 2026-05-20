import CustomButton from "@/components/ui/Button/Button";
import { Link } from "react-router-dom";

export function AuthCard({
  Head,
  BtnLabel,
  children,
  onClick,
  disabled,
  loading,
  role,
  className,
  hideFooterMessage = false,
}) {
  return (
    <div
      className={` bg-white 
        rounded-[30px]
        grid grid-cols-12
        gap-5
        p-10
      w-full
      max-w-[450px]  ${className || ""}`}
    >
      <div className="col-span-12 flex ">
        <div className="col-span-4 flex flex-col  ">
          <span
            className="
              font-semibold text-black
              text-[20px]
              sm:text-[24px]
              md:text-[26px]
              lg:text-[28px]
              2xl:text-3xl
            "
          >
            {Head}
          </span>
        </div>
      </div>

      <div className="col-span-12 flex justify-center">
        <div className="col-span-4 w-full flex flex-col gap-2.5">
          {children}
        </div>
      </div>

      <div className="col-span-12 flex justify-center">
        <div className="col-span-4 w-full flex flex-col items-center gap-2.5">
          {(role === "owner" || role === undefined) && (
            <CustomButton
              variant="primary"
              label={BtnLabel}
              fullWidth
              onClick={onClick}
              disabled={disabled}
              loading={loading}
              className="w-[-webkit-fill-available]!"
            />
          )}

          {!hideFooterMessage && (
            <p
              className="
              text-black text-center
              text-[10px]
              sm:text-xs
              md:text-sm
              mt-2
            "
            >
              By logging in, I agree to VinGo{" "}
              <Link to={"/termsofservice"}>
                <span className="text-primary underline font-bold cursor-pointer hover:text-primary-600">
                  terms & conditions
                </span>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
