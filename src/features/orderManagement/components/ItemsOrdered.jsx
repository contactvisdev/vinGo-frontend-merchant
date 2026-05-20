import { formatCurrency } from "../utils/orderFormatters";

export default function ItemsOrdered({ orderData }) {
  const orderDetails = orderData?.order || {};
  const items = orderDetails.items || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Items Ordered ({items.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-500">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => {
              const qty = item.quantity ||  item.selectedVariant.variantQuantity || 1;
              const unitPrice = item.unitPrice || item.selectedVariant.variantPrice || 0;
              const total =
                item.totalPrice !== undefined ? item.totalPrice : unitPrice * qty;

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {item.itemPic && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            alt={item.itemName || "Item"}
                            className="w-full h-full object-cover"
                            src={item.itemPic}
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {item.itemName || item.name || "Item"}
                        </p>
                        {item.itemType && (
                          <p className="text-xs text-gray-500 capitalize">
                            {item.itemType}
                          </p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.selectedAddOns
                              .map((a) => {
                                if (typeof a === "string") return a;
                                return a.name || a.addOnName || "Add-on";
                              })
                              .join(", ")}
                          </p>
                        )}
                        {item.instructions && (
                          <p className="text-xs text-gray-400 mt-0.5 italic">
                            {item.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatCurrency(unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{qty}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right">
                    {formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
