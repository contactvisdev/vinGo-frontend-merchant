import { useCallback, useMemo, useRef, useState } from "react";
import "primeicons/primeicons.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Dialog } from "primereact/dialog";
import { toImageList } from "@/helpers/commonFunctions";

const MAX_SIZE = 4 * 1024 * 1024;

const sanitizeFilename = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 100);
  return `${baseName || "upload"}.${ext}`;
};

const IMAGE_SIGNATURES = [
  { bytes: [0xFF, 0xD8, 0xFF] },                                         // JPEG
  { bytes: [0x89, 0x50, 0x4E, 0x47] },                                   // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38] },                                   // GIF
  { bytes: [0x52, 0x49, 0x46, 0x46], offset8: [0x57, 0x45, 0x42, 0x50] }, // WebP
  { bytes: [0x42, 0x4D] },                                               // BMP
  { bytes: [0x00, 0x00, 0x01, 0x00] },                                   // ICO
  { bytes: [0x00, 0x00, 0x02, 0x00] },                                   // CUR
  { bytes: [0x49, 0x49, 0x2A, 0x00] },                                   // TIFF (little-endian)
  { bytes: [0x4D, 0x4D, 0x00, 0x2A] },                                   // TIFF (big-endian)
  { offset4: [0x66, 0x74, 0x79, 0x70] },                                 // HEIC / HEIF / AVIF (ISO BMFF "ftyp")
  { bytes: [0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20, 0x20] },           // JPEG 2000 (JP2)
  { bytes: [0xFF, 0x4F, 0xFF, 0x51] },                                   // JPEG 2000 codestream (J2C)
  { bytes: [0x38, 0x42, 0x50, 0x53] },                                   // PSD (Photoshop "8BPS")
  { bytes: [0x44, 0x44, 0x53, 0x20] },                                   // DDS ("DDS ")
  { textStart: ["<svg", "<?xml"] },                                      // SVG
  { textStart: ["#?RADIANCE"] },                                         // HDR
];

const decodeTextHead = (bytes) =>
  new TextDecoder("utf-8", { fatal: false }).decode(bytes).trimStart();

const isValidImageSignature = async (file) => {
  const buffer = await file.slice(0, 64).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const textHead = decodeTextHead(bytes);
  return IMAGE_SIGNATURES.some((sig) => {
    if (sig.bytes) {
      const headMatch = sig.bytes.every((b, i) => bytes[i] === b);
      if (!headMatch) return false;
      if (sig.offset8) return sig.offset8.every((b, i) => bytes[8 + i] === b);
      return true;
    }
    if (sig.offset4) {
      return sig.offset4.every((b, i) => bytes[4 + i] === b);
    }
    if (sig.textStart) {
      return sig.textStart.some((prefix) => textHead.startsWith(prefix));
    }
    return false;
  });
};

function getCroppedImg(image, crop) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob], "cropped-image.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.95
    );
  });
}

export default function CustomImageUploaderBox({
  name,
  label = "",
  data,
  onChange,
  uploadApi,
  isUploading = false,
  hasError = false,
  errorMessage = "",
  disabled = false,
  aspectRatio = null,
  sizeHint = null,
  required = true,
  multiple = false,
}) {
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const rawValue = data?.[name];
  const imageList = useMemo(() => toImageList(rawValue), [rawValue]);
  const fileUrl = imageList[0];

  const [localError, setLocalError] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState(undefined);
  const [multiCropQueue, setMultiCropQueue] = useState([]);
  const [multiCropIndex, setMultiCropIndex] = useState(0);
  const [multiCroppedBatch, setMultiCroppedBatch] = useState([]);

  const inMultiCropFlow = multiCropQueue.length > 0;

  const openCropForFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCrop(undefined);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const resetMultiCropState = useCallback(() => {
    setMultiCropQueue([]);
    setMultiCropIndex(0);
    setMultiCroppedBatch([]);
  }, []);

  const validateFile = async (file) => {
    if (!file.type.startsWith("image/")) return "Only image files allowed.";
    if (file.size > MAX_SIZE) return "Max size is 4MB.";
    const validSignature = await isValidImageSignature(file);
    if (!validSignature) return "Invalid image file.";
    return "";
  };

  const onImageLoaded = useCallback(
    (e) => {
      imgRef.current = e.currentTarget;
      const { width, height } = e.currentTarget;
      const size = Math.min(width, height, 250);
      const ratio = aspectRatio || 1;

      let cropWidth, cropHeight;
      if (ratio >= 1) {
        cropWidth = size;
        cropHeight = size / ratio;
      } else {
        cropHeight = size;
        cropWidth = size * ratio;
      }

      setCrop({
        unit: "px",
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      });
    },
    [aspectRatio]
  );

  const handleSelect = useCallback(
    async (e) => {
      const selected = Array.from(e.target.files || []);
      if (!selected.length) return;

      if (multiple) {
        const results = await Promise.all(
          selected.map(async (file) => ({ file, error: await validateFile(file) })),
        );
        const accepted = [];
        let lastError = "";
        for (const { file, error } of results) {
          if (error) {
            lastError = error;
            continue;
          }
          accepted.push(new File([file], sanitizeFilename(file.name), { type: file.type }));
        }
        e.target.value = "";
        if (!accepted.length) {
          if (lastError) setLocalError(lastError);
          return;
        }
        setLocalError("");

        if (aspectRatio) {
          setMultiCropQueue(accepted);
          setMultiCropIndex(0);
          setMultiCroppedBatch([]);
          openCropForFile(accepted[0]);
        } else {
          await uploadApi(accepted, name);
        }
        return;
      }

      const file = selected[0];
      const error = await validateFile(file);
      if (error) {
        setLocalError(error);
        return;
      }

      setLocalError("");

      if (!aspectRatio) {
        const sanitized = new File([file], sanitizeFilename(file.name), { type: file.type });
        await uploadApi(sanitized, name);
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCrop(undefined);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [aspectRatio, uploadApi, name, multiple, openCropForFile]
  );

  const handleRemoveAt = useCallback(
    (index) => {
      const next = imageList.filter((_, i) => i !== index);
      const value = next.length === 0 ? "" : next.length === 1 ? next[0] : next;
      if (onChange) onChange({ name, value });
    },
    [imageList, onChange, name]
  );

  const handleCropConfirm = useCallback(async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;

    const cropped = await getCroppedImg(imgRef.current, crop);

    if (inMultiCropFlow) {
      const nextBatch = [...multiCroppedBatch, cropped];
      const nextIndex = multiCropIndex + 1;

      if (nextIndex >= multiCropQueue.length) {
        setCropModalOpen(false);
        setImageSrc(null);
        resetMultiCropState();
        await uploadApi(nextBatch, name);
      } else {
        setMultiCroppedBatch(nextBatch);
        setMultiCropIndex(nextIndex);
        openCropForFile(multiCropQueue[nextIndex]);
      }
      return;
    }

    setCropModalOpen(false);
    setImageSrc(null);
    await uploadApi(cropped, name);
  }, [
    crop,
    uploadApi,
    name,
    inMultiCropFlow,
    multiCroppedBatch,
    multiCropIndex,
    multiCropQueue,
    openCropForFile,
    resetMultiCropState,
  ]);

  const handleSkipAllCrops = useCallback(async () => {
    if (!inMultiCropFlow) return;
    const remaining = multiCropQueue.slice(multiCropIndex);
    const allFiles = [...multiCroppedBatch, ...remaining];
    setCropModalOpen(false);
    setImageSrc(null);
    resetMultiCropState();
    await uploadApi(allFiles, name);
  }, [
    inMultiCropFlow,
    multiCropQueue,
    multiCropIndex,
    multiCroppedBatch,
    uploadApi,
    name,
    resetMultiCropState,
  ]);

  const handleCropCancel = useCallback(() => {
    setCropModalOpen(false);
    setImageSrc(null);
    resetMultiCropState();
  }, [resetMultiCropState]);

  const handleRemove = useCallback(() => {
    setLocalError("");
    if (onChange) onChange({ name, value: "" });
    if (fileRef.current) fileRef.current.value = "";
  }, [name, onChange]);

  const openFileDialog = () => {
    if (!isUploading && !disabled) fileRef.current?.click();
  };

  return (
    <div>
      {label && (
        <label className="2xl:text-base lg:text-sm text-xs text-neutral-900 mb-1 flex items-start gap-[2px]">
          {label}
          {required &&
          <i className="pi pi-asterisk -mt-1" />
          }
        </label>
      )}

      {multiple ? (
        <div
          className={`border border-dashed rounded-lg p-3 bg-gray-50
          ${hasError ? "border-primary" : "border-neutral-400"}
          ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
          {imageList.length === 0 && !isUploading ? (
            <div
              onClick={openFileDialog}
              className={`h-28 flex flex-col items-center justify-center gap-1 ${isUploading ? "" : "cursor-pointer"}`}
            >
              <span className="text-gray-400 text-sm">Click to upload images</span>
              {sizeHint && (
                <span className="text-gray-400 2xl:text-xs lg:text-[10px] text-[9px]">{sizeHint}</span>
              )}
              {errorMessage && (
                <span className="text-primary 2xl:text-sm lg:text-xs text-[10px]">{errorMessage}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {imageList.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative w-24 h-24 rounded border border-neutral-200 overflow-hidden bg-white"
                >
                  <img
                    src={url}
                    alt={`${label || name || "upload"} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAt(index);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full shadow px-1.5 py-0.5 text-[10px] cursor-pointer"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {isUploading ? (
                <div className="w-24 h-24 rounded border border-neutral-200 flex items-center justify-center bg-white">
                  <ClipLoader size={20} color="#ff69b4" cssOverride={{ borderWidth: "2px" }} />
                </div>
              ) : (
                !disabled && (
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="w-24 h-24 rounded border border-dashed border-neutral-400 flex flex-col items-center justify-center text-gray-400 text-xs cursor-pointer hover:border-primary hover:text-primary"
                  >
                    <span className="text-xl leading-none">+</span>
                    <span>Add more</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          className={`relative border border-dashed rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50
          ${hasError ? "border-primary" : "border-neutral-400"}
          ${disabled || isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        >
          {isUploading ? (
            <ClipLoader size={30} color="#ff69b4" cssOverride={{ borderWidth: "3px" }} />
          ) : fileUrl ? (
            <>
              <img src={fileUrl} alt={label || name || "Uploaded image"} className="h-full object-contain rounded" />

              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full shadow px-2 py-1 text-xs"
                >
                  ✕
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-sm">Click to upload</span>
              {sizeHint && (
                <span className="text-gray-400 2xl:text-xs lg:text-[10px] text-[9px]">{sizeHint}</span>
              )}
              {errorMessage && (
                <span className="text-primary 2xl:text-sm lg:text-xs text-[10px]">{errorMessage}</span>
              )}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleSelect}
      />

      {localError && (
        <p className="text-red-500 2xl:text-sm lg:text-xs text-[10px] mt-1">
          {localError}
        </p>
      )}

      <Dialog
        visible={cropModalOpen}
        onHide={handleCropCancel}
        header={
          inMultiCropFlow
            ? `Crop Image (${multiCropIndex + 1} of ${multiCropQueue.length})`
            : "Crop Image"
        }
        modal
        dismissableMask
        style={{ width: "90vw", maxWidth: "500px" }}
        footer={
          <div className="flex justify-end gap-2 pt-2 flex-wrap">
            <button
              type="button"
              onClick={handleCropCancel}
              className="px-4 py-2 text-sm border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50"
            >
              Cancel
            </button>
            {inMultiCropFlow && (
              <button
                type="button"
                onClick={handleSkipAllCrops}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50"
              >
                Upload without crop
              </button>
            )}
            <button
              type="button"
              onClick={handleCropConfirm}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg cursor-pointer hover:opacity-90"
            >
              {inMultiCropFlow
                ? multiCropIndex < multiCropQueue.length - 1
                  ? "Next"
                  : "Upload"
                : "Confirm"}
            </button>
          </div>
        }
      >
        {imageSrc && (
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              minWidth={50}
              minHeight={50}
            >
              <img
                src={imageSrc}
                onLoad={onImageLoaded}
                alt="Crop preview"
                style={{ maxHeight: "350px", maxWidth: "100%" }}
              />
            </ReactCrop>
          </div>
        )}
      </Dialog>
    </div>
  );
}
