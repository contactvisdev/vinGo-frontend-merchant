import { CheckCircle } from 'lucide-react';

export default function VerifiedDocuments({
  title = "KvK Registration Certificate",
  fileName = "Registration_certificate.pdf",
  status = "Verified",
  onClick
}) {
  return (
    <div
      className="bg-white p-4 rounded-xl border border-neutral-400 flex flex-col gap-2  lg:h-[149px] cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      {/* Title */}
      <p className="text-sm font-semibold text-black">{title}</p>

      {/* File Name */}
      <p className="text-xs text-gray-500 truncate">{fileName}</p>

      {/* Bottom Section */}
      <div className="flex items-center justify-end mt-2">
        {/* Verified Badge */}
        <span className="flex items-center gap-1 bg-success-50 text-success text-[11px] px-3 py-1 rounded-full">
          <CheckCircle size={12} />
          {status}
        </span>
      </div>
    </div>
  );
}
