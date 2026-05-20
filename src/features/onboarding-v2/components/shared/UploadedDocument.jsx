import { useRef, useState } from "react";
import "primeicons/primeicons.css";
import fileIconDefault from "@/assets/images/icons/file.png";
import deleteIconDefault from "@/assets/images/icons/delete.png";
import InputLayout from "@/components/forms/InputLayout";
import CustomButton from "@/components/ui/Button/Button";
import ClipLoader from "react-spinners/ClipLoader";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function CustomFileUpload({
  name,
  label,
  data,
  onChange,
  uploadApi,
  required = false,
  col = 12,
  extraClassName = "",
  errorMessage = "",
  labelClassName = "",
  onlyImage,
  isLoading = false,
}) {
  const fileRef = useRef(null);
  const [localError, setLocalError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLocalError("");
    if (file.size > 4 * 1024 * 1024) {
      setLocalError("File size must be less than 4MB.");
      return;
    }

    const fileType = file.type;

    if (onlyImage) {
      if (!fileType.startsWith("image/")) {
        setLocalError("Only image files are allowed.");
        return;
      }
    } else {
      const isImage = fileType.startsWith("image/");
      const isPdf = fileType === "application/pdf";

      if (!isImage && !isPdf) {
        setLocalError("Only image or PDF files are allowed.");
        return;
      }
    }

    await uploadApi(file, name);
  };

  const handleDelete = () => {
    onChange({ name, value: "" });
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };
  const fileUrl = data?.[name];

  return (
    <InputLayout
      label={label}
      name={name}
      data={data}
      errorMessage={errorMessage || localError}
      required={required}
      col={col}
      extraClassName={extraClassName}
      labelClassName={labelClassName}
    >
      <div>
        {isLoading && (
          <div className="flex items-center w-full bg-neutral-100 px-5 py-3 2xl:h-[50px] lg:h-[45px] rounded-xl">
            <ClipLoader
              size={20}
              color="#ff69b4"
              cssOverride={{ borderWidth: "3px" }}
            />
            <span className="ml-3 text-sm text-neutral-500">Uploading...</span>
          </div>
        )}

        {!isLoading && fileUrl && (
          <div className="flex items-center justify-between w-full bg-neutral-100 px-5 py-3 2xl:h-[50px] lg:h-[45px] rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <SkeletonImage className="h-5" src={fileIconDefault} alt="file" />
              <p className="text-base font-medium text-black">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  View Uploaded File
                </a>
              </p>
            </div>

            <button onClick={handleDelete} className="hover:opacity-60">
              <SkeletonImage
                src={deleteIconDefault}
                className="h-5"
                alt="delete"
              />
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleFileSelect}
          accept={onlyImage ? "image/*" : "image/*,application/pdf"}
        />

        {!isLoading && !fileUrl && (
          <div className="flex items-center 2xl:h-[50px] lg:h-[45px]">
            <CustomButton
              variant="primary"
              label="File upload"
              fullWidth={false}
              className="px-8"
              onClick={() => fileRef.current.click()}
            />
          </div>
        )}
      </div>
    </InputLayout>
  );
}
