import { formatCurrency } from "../utils/orderFormatters";
import { Printer } from "lucide-react";

export default function PaymentSummary({ orderData }) {
  const orderDetails = orderData?.order || {};
  const subtotal = orderDetails.subtotal || 0;
  const tax = orderDetails.tax || 0;
  const tip = orderDetails.tip || 0;
  const totalAmount = orderDetails.totalAmount || 0;
  const fees = orderDetails.fees || [];
  const deliveryFee = fees.find((f) => f.type === "delivery")?.amount || 0;
  const serviceFee = fees.find((f) => f.type === "service")?.amount || 0;
  const discountedSubtotal = orderData?.discountedSubtotal || 0;
  const originalAmount = orderData?.originalAmount || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Summary</h3>
      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="font-medium">{formatCurrency(deliveryFee)}</span>
          </div>
        )}
        {serviceFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Service Fee</span>
            <span className="font-medium">{formatCurrency(serviceFee)}</span>
          </div>
        )}
        {tax > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
        )}
        {tip > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Tip</span>
            <span className="font-medium">{formatCurrency(tip)}</span>
          </div>
        )}
        {discountedSubtotal > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discountedSubtotal)}
            </span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-extrabold">Grand Total</span>
            <span className="text-2xl font-extrabold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
      {/* <button
        onClick={() => window.print()}
        className="w-full mt-8 bg-primary text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <Printer size={18} />
        Print Invoice
      </button> */}
    </div>
  );
}
