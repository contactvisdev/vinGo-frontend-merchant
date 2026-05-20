import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { neutral, success, error as errorColors } from "@/helpers/constants/themeColors";

function ToastContainer() {
  const { toastInfo } = useSelector((state) => state?.common);

  useEffect(() => {
    if (toastInfo?.title) {
      const message = toastInfo.detail
        ? `${toastInfo.title}: ${toastInfo.detail}`
        : toastInfo.title;

      switch (toastInfo.type) {
        case "success":
          toast.success(message);
          break;
        case "error":
        case "danger":
          toast.error(message);
          break;
        case "warn":
        case "warning":
          toast(message);
          break;
        case "info":
        default:
          toast(message);
      }
    }
  }, [toastInfo]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: neutral[700],
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
        success: {
          style: { background: success[100], color: success[700] },
          iconTheme: { primary: success.DEFAULT, secondary: "#fff" },
        },
        error: {
          style: { background: errorColors[50], color: errorColors[700] },
          iconTheme: { primary: errorColors.DEFAULT, secondary: "#fff" },
        },
      }}
    />
  );
}

export default ToastContainer;
