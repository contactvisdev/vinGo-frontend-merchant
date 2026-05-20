import { formatCustomerName, formatDeliveryAddress } from "../utils/orderFormatters";
import { User, StickyNote } from "lucide-react";

export default function CustomerDetails({ orderData }) {
  const orderDetails = orderData?.order || {};
  const customerName = formatCustomerName(orderData?.customerName);
  const customerNumber = orderData?.customerNumber || null;
  const instructions = orderDetails.instructions || null;

  const dropLocation = orderDetails.drop_location || {};
  const pickupLocation = orderDetails.location || {};
  const deliveryAddress = formatDeliveryAddress(dropLocation, pickupLocation);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <User size={20} className="text-primary" />
        Customer Details
      </h3>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
            Customer Name
          </p>
          <p className="text-sm font-bold text-gray-900">{customerName}</p>
          {customerNumber && (
            <p className="text-sm font-medium text-gray-600">{customerNumber}</p>
          )}
        </div>
        {orderData?.orderType === "delivery" && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Delivery Address
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {deliveryAddress}
            </p>
          </div>
        )}
        {instructions && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/50">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1">
              <StickyNote size={14} />
              Instructions
            </p>
            <p className="text-sm italic text-gray-600 break-words">&quot;{instructions}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
