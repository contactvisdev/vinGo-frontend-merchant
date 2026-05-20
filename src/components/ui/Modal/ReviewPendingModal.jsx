import React from "react";
import { Dialog } from "primereact/dialog";
import CustomButton from "@/components/ui/Button/Button";
import homeicon from "../../../assets/images/icons/home-icon.png";
import timer from "../../../assets/images/icons/timer.png";
import info from "../../../assets/images/icons/info.png";
import SkeletonImage from "@/components/ui/SkeletonImage";

const ReviewPendingModal = React.memo(function ReviewPendingModal({ visible, onHide }) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      showHeader={false}
      modal
      className="w-[800px]"
      pt={{ content: { className: 'p-10!' } }}
      closable={true}
    >
      <div className="flex flex-col items-center p-4 pb-0 bg-white rounded-lg">
        <div className="mb-4">
          <SkeletonImage src={homeicon} alt="VinGo" />
        </div>

        <h2 className="text-[22px] font-medium text-neutral-700 mb-3 text-center">
          Verification In progress
        </h2>

        <SkeletonImage src={timer} alt="VinGo" />
        <div className="px-18 mt-2">
          <p className=" text-center text-black mb-6 text-3xl font-semibold m-0!">
            Your documents are under review{" "}
          </p>
          <p className="text-base text-neutral-500 text-center mb-4">
            We're verifying your submitted documents. This process usually takes
            24–48 hours.
          </p>
          <div className="border border-info-100 bg-info-50 text-info text-left flex items-start gap-3 p-4 rounded-[10px] mb-4">
            <SkeletonImage src={info} alt="VinGo" className="mt-1" />
            <p className="text-sm">
              No action is required at this time. You'll be notified once the
              review is complete. If any documents are rejected, you'll receive
              instructions for re-uploading.
            </p>
          </div>
        </div>
        <CustomButton
          variant="primary"
          label="Close"
          onClick={onHide}
          fullWidth={false}
          className="mt-1"
        />
      </div>
    </Dialog>
  );
});

ReviewPendingModal.displayName = "ReviewPendingModal";

export default ReviewPendingModal;
