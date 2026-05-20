import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CustomOtpInput } from "@/components/forms/CustomOtpInput";
import formValidation from "@/helpers/validations";
import { showFormErrors } from "@/helpers/commonFunctions";
import { AuthCard } from "@/features/auth/components/Auth";
import { useAuthApi, useOtpTimer } from "@features/auth/hooks";
import ReviewPendingModal from "@/components/ui/Modal/ReviewPendingModal";
import { useLazyGetCategoriesQuery } from "@/store/api/categoryApi";
import { useLazyGetUserProfileQuery } from "@/store/api/userProfileApi";
import { useLazyGetStaffByIdQuery } from "@/store/api/businessStaffApi";
import { setExistingMerchants } from "@/store/ownerProfileSlice";

const OTP_LENGTH = 6;
const RESEND_DELAY_MS = 1000;

export default function OtpVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const phone = state?.merchantData || {};
  const role = state?.role ?? "owner";
  const { loginUser, resendOtp, loading, getMerchantsByOwner } = useAuthApi();
  const { timeLeft, resetTimer, clearTimer, isExpired } = useOtpTimer();
  const merchantExists = useSelector((s) => s?.ownerProfile?.merchantExists);
  const [triggerGetCategories] = useLazyGetCategoriesQuery();
  const [triggerGetUserProfile] = useLazyGetUserProfileQuery();
  const [triggerGetStaffById] = useLazyGetStaffByIdQuery();

  const [isResending, setIsResending] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [mobileOtpData, setMobileOtpData] = useState({
    mobileOtp: "",
  });

  const handleMobileOtpChange = useCallback(
    ({ name, value }) => {
      const formErrors = formValidation(name, value, mobileOtpData);
      setMobileOtpData((prev) => ({ ...prev, [name]: value, formErrors }));
    },
    [mobileOtpData],
  );

  const handleResendOtp = useCallback(async () => {
    if (isResending || loading) return;

    try {
      setIsResending(true);
      await resendOtp({ phone, role }, () => {
        setMobileOtpData({ mobileOtp: "" });
        resetTimer();

        setTimeout(() => {
          setIsResending(false);
        }, RESEND_DELAY_MS);
      });
    } catch(error) {
      if(import.meta.env.DEV) console.log("Error resending OTP", error);
      setIsResending(false);
    }
  }, [phone, role, resendOtp, resetTimer, isResending, loading]);
  useEffect(() => {
    if (!state?.merchantData) {
      navigate("/");
    }
  }, [state, navigate]);

  const handleOtpSubmit = useCallback(async () => {
    if (!showFormErrors(mobileOtpData, setMobileOtpData)) {
      return;
    }

    try {
      const result = await loginUser(
        { phone, otp: mobileOtpData?.mobileOtp, role },
        () => clearTimer(),
      );

      const user = result?.data?.user;
      const categoryName = user?.categoryName;

      if (categoryName) {
        navigate("/dashboard");
        return;
      }

      const userId = user?._id;
      const userRole = user?.role ?? role;

      const prefetchTasks = [triggerGetCategories()];

      if (userId) {
        prefetchTasks.push(triggerGetUserProfile());
      }

      if (merchantExists && userId) {
        if (userRole === "staff") {
          prefetchTasks.push(triggerGetStaffById({ id: userId }));
        } else {
          prefetchTasks.push(
            getMerchantsByOwner(userId)
              .then((res) => dispatch(setExistingMerchants(res?.data?.list || []))),
          );
        }
      }

      const results = await Promise.allSettled(prefetchTasks);

      if (import.meta.env.DEV) {
        results.forEach((r, i) => {
          if (r.status === "rejected") {
            console.warn(`Prefetch task ${i} failed:`, r.reason);
          }
        });
      }

      navigate("/select-category");
    } catch(error) {
      if(import.meta.env.DEV) console.log("Error submitting OTP", error);
    }
  }, [
    phone,
    role,
    mobileOtpData,
    loginUser,
    clearTimer,
    navigate,
    merchantExists,
    dispatch,
    triggerGetCategories,
    triggerGetUserProfile,
    triggerGetStaffById,
    getMerchantsByOwner,
  ]);

  const handleCloseReviewModal = useCallback(() => {
    setShowReviewModal(false);
    navigate("/");
  }, [navigate]);

  const maskPhone = (phoneNumber) => {
    if (!phoneNumber) return "";
    const str = phoneNumber.toString();
    const last4 = str.slice(-4);
    return "XXXXXXX" + last4;
  };

  const isSubmitDisabled =
    mobileOtpData?.mobileOtp?.length !== OTP_LENGTH || isExpired || loading;

  return (
    <div className="home-container w-full h-full">
      <div className="home-content overflow-hidden md:overflow-visible flex flex-col items-center justify-center gap-[50px] md:gap-[70px] xl:gap-[200px] 2xl:gap-[150px] lg:flex-row lg:items-center lg:justify-center md:px-10 lg:px-20">
        <img
          src="/images/bg-image.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-content__bg"
        />
        <div className="home-content__overlay" />
        {/* Left Side Text */}
        <p className="text-center md:text-center text-3xl md:text-[34px] lg:text-[40px] 2xl:text-[60px] lg:text-left font-bold leading-tight 2xl:pr-8">
          Grow Your Business
          <br /> with VinGo Platform
        </p>

        {/* OTP Card */}
        <AuthCard
          Head="Enter OTP"
          BtnLabel="Continue"
          onClick={handleOtpSubmit}
          disabled={isSubmitDisabled}
          loading={loading}
          hideFooterMessage={true}
        >
          <p className="2xl:text-base lg:text-sm text-xs text-neutral-900">
            Enter OTP Sent on number <span>{maskPhone(phone)}</span>
          </p>

          <CustomOtpInput
            name="mobileOtp"
            onChange={handleMobileOtpChange}
            data={mobileOtpData}
            ignoreLabel
          />

          {/* Resend OTP Section */}
          {timeLeft > 0 ? (
            <p className="text-center text-neutral-500 text-sm md:text-sm lg:text-base 2xl:text-[18px]">
              Resend Code in{" "}
              <span className="underline font-semibold text-primary">
                {timeLeft}s
              </span>
            </p>
          ) : (
            <p
              className="cursor-pointer text-center text-primary text-sm md:text-sm lg:text-base 2xl:text-[18px] underline font-semibold"
              onClick={handleResendOtp}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </p>
          )}
        </AuthCard>
      </div>

      {/* Review Pending Modal */}
      <ReviewPendingModal
        visible={showReviewModal}
        onHide={handleCloseReviewModal}
      />
    </div>
  );
}
