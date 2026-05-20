import { formatDateTime } from "../utils/orderFormatters";
import { Gift, MessageCircle } from "lucide-react";

export default function GiftDetails({ orderData }) {
  const giftDetails = orderData?.giftDetails;

  if (!giftDetails) return null;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Gift size={20} className="text-primary" />
        Gift Details
      </h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              From
            </p>
            <p className="text-sm font-bold text-gray-900">
              {giftDetails.from || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              To
            </p>
            <p className="text-sm font-bold text-gray-900">
              {giftDetails.to || "N/A"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
            Gift Created
          </p>
          <p className="text-sm font-medium text-gray-600">
            {formatDateTime(giftDetails.createdAt)}
          </p>
        </div>
        {giftDetails.personalisedMessage && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1 flex items-center gap-1">
              <MessageCircle size={14} />
              Personalised Message
            </p>
            <p className="text-sm italic text-gray-900 font-medium break-words">
              &quot;{giftDetails.personalisedMessage}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
