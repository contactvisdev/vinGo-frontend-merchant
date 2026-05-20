import {
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  PackageCheck,
  Package,
  MapPin,
  XCircle,
} from "lucide-react";

const STATUS_ICONS = {
  pending: Clock,
  merchant_accepted: CheckCircle2,
  confirmed: UtensilsCrossed,
  preparing: UtensilsCrossed,
  at_restaurant: PackageCheck,
  ready_for_pickup: PackageCheck,
  picked_up: Package,
  reached_drop: MapPin,
  delivered: CheckCircle2,
};

const getNodeStyles = (isCompleted, isCurrent) => {
  if (isCompleted)
    return "bg-green-500 text-white ring-8 ring-white shadow-lg shadow-green-200";
  if (isCurrent)
    return "bg-primary text-white ring-8 ring-white shadow-lg shadow-primary/20";
  return "bg-gray-200 text-gray-400 ring-8 ring-white";
};

const getIconColor = (isCompleted, isCurrent) => {
  if (isCompleted || isCurrent) return "text-white";
  return "text-gray-400";
};

const getTooltipText = (isClickable, isLoading, isCompleted, isCurrent, label) => {
  if (isClickable && !isLoading) return "Click to update";
  if (isCompleted) return "Completed";
  if (isCurrent) return "Current step";
  return label;
};

export default function OrderTimeline({
  timelineStatuses,
  currentStatusIndex,
  getStatusItemProps,
  timelineLoading,
  onStatusUpdate,
  isRejected,
  rejectedAt,
}) {
  // Each step is flex-1 so center of step i = (i + 0.5) / stepCount * 100%
  // Line runs between first and last node centers
  const stepCount = isRejected ? timelineStatuses.length + 1 : timelineStatuses.length;
  const trackLeft = `${(0.5 / stepCount) * 100}%`;
  const trackWidth = `${((stepCount - 1) / stepCount) * 100}%`;

  const getProgressWidth = () => {
    if (currentStatusIndex <= 0 && !isRejected) return "0%";
    const filled = isRejected ? currentStatusIndex + 1 : currentStatusIndex;
    return `${(filled / stepCount) * 100}%`;
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100">
      <div className="relative flex justify-between items-start w-full max-w-8xl mx-auto">
        {/* Background track line — only between first and last node centers */}
        <div
          className="absolute h-1 bg-gray-200 top-[20px] z-0 rounded-full"
          style={{ left: trackLeft, width: trackWidth }}
        />
        {/* Progress fill line */}
        <div
          className="absolute h-1 bg-green-500 top-[20px] z-0 rounded-full transition-all duration-700"
          style={{ left: trackLeft, width: getProgressWidth() }}
        />

        {timelineStatuses.map((statusItem, index) => {
          const rawProps = getStatusItemProps(statusItem, index);
          const statusInTimeline = rawProps.statusInTimeline;
          const isCurrent = isRejected ? false : rawProps.isCurrent;
          const isCompleted = isRejected ? statusInTimeline : rawProps.isCompleted;
          const isClickable = isRejected ? false : rawProps.isClickable;
          const isLoading = isRejected ? false : rawProps.isLoading;
          const Icon = STATUS_ICONS[statusItem.key] || Clock;
          const isInactive = !isCompleted && !isCurrent;

          return (
            <div
              key={statusItem.key}
              className="relative z-10 flex flex-col items-center gap-4 flex-1"
            >
              <div
                className={`group relative ${isClickable ? "cursor-pointer" : ""}`}
              >
                <div
                  onClick={() => isClickable && onStatusUpdate(statusItem.key)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${getNodeStyles(isCompleted, isCurrent)} ${
                    isClickable
                      ? "hover:scale-110 hover:shadow-xl hover:shadow-primary/30"
                      : ""
                  } ${isLoading ? "opacity-50 cursor-wait animate-pulse" : ""}`}
                >
                  <Icon size={20} className={getIconColor(isCompleted, isCurrent)} />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-[100] pointer-events-none shadow-lg">
                  {getTooltipText(isClickable, isLoading, isCompleted, isCurrent, statusItem.label)}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-800" />
                </span>
              </div>

              <div className={`text-center ${isInactive ? "opacity-60" : ""}`}>
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    isCurrent
                      ? "text-gray-900"
                      : isCompleted
                        ? "text-green-700"
                        : "text-gray-500"
                  }`}
                >
                  {statusItem.label}
                </span>
                {isLoading && (
                  <span className="block text-xs text-primary mt-1 font-medium">
                    Updating...
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Merchant Rejected terminal node */}
        {isRejected && (
          <div className="relative z-10 flex flex-col items-center gap-4 flex-1">
            <div className="group relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white ring-8 ring-white shadow-lg shadow-red-200">
                <XCircle size={20} className="text-white" />
              </div>
              {rejectedAt && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-[100] pointer-events-none shadow-lg">
                  {rejectedAt}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-800" />
                </span>
              )}
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-extrabold text-red-500 uppercase tracking-[0.15em] mb-1">
                Rejected
              </span>
              <span className="text-xs font-bold text-red-600 whitespace-nowrap">
                Order Rejected
              </span>
              {rejectedAt && (
                <span className="block text-[10px] text-gray-400 mt-1">{rejectedAt}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* {!isRejected && currentStatusIndex < 2 && (
        <div className="mt-8 text-sm text-gray-500 text-center bg-primary/5 py-2.5 px-4 rounded-lg border border-primary/10">
          Click on the next status icon to progress the order (cannot skip statuses)
        </div>
      )} */}
    </div>
  );
}
