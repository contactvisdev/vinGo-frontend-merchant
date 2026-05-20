import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BaseCard from "@/components/ui/Card/Card";
import CustomButton from "@/components/ui/Button/Button";
import { logout } from "@/helpers/auth";
import { persistor } from "@/store";
import info from "@/assets/images/icons/info.png";
import timer from "@/assets/images/icons/timer.png";
import logo from "@/assets/images/icons/home-icon.png";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function SubmittedPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    await logout(() => navigate("/", { replace: true }), dispatch, persistor);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[200px] py-8 sm:py-12 md:py-16 lg:py-20 xl:py-[120px]">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
        <BaseCard extraClassName="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="text-center flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-5 w-full">
            <SkeletonImage src={logo} className="h-12 sm:h-14 md:h-16 lg:h-[50px]" alt="Success" />
            <span className="text-[22px] font-semibold">Verification In Progress</span>
            <SkeletonImage src={timer} alt="timer" />
            <p className="font-semibold sm:text-lg md:text-xl lg:text-[24px] 2xl:text-[26px]">Your documents are under review</p>
            <span className="text-neutral-500 max-w-[500px]">We're verifying your submitted documents. This process usually takes 24–48 hours.</span>
            <div className="bg-info-50 p-4 rounded-[10px] border border-info-100 w-full max-w-[500px]">
              <p className="text-info flex items-start gap-3 text-left w-full">
                <SkeletonImage src={info} alt="info" className="mt-1 shrink-0" />
                <span className="w-full break-words">No action is required at this time. You'll be notified once the review is complete. If any documents are rejected, you'll receive instructions for re-uploading.</span>
              </p>
            </div>
            <div className="w-full flex justify-center">
              <CustomButton label="Back To Login" variant="primary" onClick={handleLogout} />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
