import { ChevronRight, X } from "lucide-react";

const STATUS_STYLES = {
  verified: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  default: "bg-neutral-100 text-neutral-600",
};

function getStatusStyle(business) {
  if (business.isDocumentVerified) return STATUS_STYLES.verified;
  if (business.isDocumentVerified === false) return STATUS_STYLES.pending;
  return STATUS_STYLES.default;
}

export default function BusinessCard({ business, onClick, onDelete }) {
  const name = business.business?.businessName || "Unnamed Business";
  const hasName = !!business.business?.businessName;
  const statusStyle = getStatusStyle(business);

  return (
    <button
      onClick={() => onClick(business)}
      className="group w-full flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-primary hover:shadow-sm transition-all duration-200 text-left cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 truncate">{name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle}`}
          >
            {business.status}
          </span>
          {hasName && (
            <span className="text-xs text-neutral-400">
              {new Date(business.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      {onDelete && (
        <span
          role="button"
          title="Delete business"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(business);
          }}
          className="shrink-0 p-1 rounded-full text-neutral-600 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X size={16} />
        </span>
      )}

      <ChevronRight
        size={18}
        className="shrink-0 text-neutral-600 group-hover:text-primary transition-colors"
      />
    </button>
  );
}
