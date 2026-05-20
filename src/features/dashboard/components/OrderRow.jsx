import { formatCurrency, formatLocaleDateTime } from "@/helpers/formatters";
import IconButton from "@/components/ui/Button/IconButton";
import { useNavigate } from "react-router-dom";
import EyeIcon from "@/assets/icons/eye.svg";

const EyeIconComponent = ({ size = 18 }) => (
  <img
    src={EyeIcon}
    alt=""
    width={size}
    height={size}
    className="inline-block"
  />
);

const formatStatus = (status) =>
  ((status || "pending").replace(/^merchant_/i, "")).split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

function normalizeOrder(order, index) {
  const merchantOrder = order.orders?.[0] || order;
  const customer = order.customerId;
  const hasApiShape = Boolean(order.orders?.[0] && customer);

  const customerName = hasApiShape
    ? ([customer?.firstName, customer?.lastName].filter(Boolean).join(" ").trim() || customer?.email || "N/A")
    : (order.customerName || "N/A");

  const rawStatus = (hasApiShape ? merchantOrder.status : order.status) || "pending";

  return {
    orderId: order._id ? `#${order._id.slice(-6)}` : (order.id || `#${index}`),
    customerName,
    items: (merchantOrder.items || []).map((i) => i.itemName || i.name || i).join(", ") || "N/A",
    status: formatStatus(rawStatus),
    rawStatus,
    createdAt: order.createdAt,
    totalAmount: merchantOrder.totalAmount ?? order.totalPrice ?? order.total ?? 0,
    currency: merchantOrder.currency || order.currency || "USD",
  };
}

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  merchant_accepted: "bg-blue-100 text-blue-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-blue-100 text-blue-700",
  ready_for_pickup: "bg-green-100 text-green-700",
  at_restaurant: "bg-green-100 text-green-700",
  picked_up: "bg-green-100 text-green-700",
  reached_drop: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  "in progress": "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
};

const getStatusStyle = (statusKey) =>
  STATUS_STYLES[(statusKey || "").toLowerCase()] || "bg-gray-100 text-gray-700";

export default function OrderRow({ order, index }) {
  const navigate = useNavigate();
  const { orderId, customerName, items, status, rawStatus, createdAt, totalAmount } = normalizeOrder(order, index);
  const orderDate = formatLocaleDateTime(createdAt);
  const total = formatCurrency(totalAmount);
  const [datetme, time] = orderDate.split(", ");

  return (
    <tr className="border-b border-gray-200">
      <td className="p-2 sm:p-3 text-primary-600">{orderId}</td>
      <td className="p-2 sm:p-3">{customerName}</td>
      <td className="p-2 sm:p-3 hidden md:table-cell">{items}</td>
      <td className="p-2 sm:p-3">
        <span
          className={`inline-block whitespace-nowrap px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusStyle(rawStatus)}`}
        >
          {status}
        </span>
      </td>
      <td className="p-2 sm:p-3 hidden lg:table-cell text-gray-500">
        <span className="font-semibold">{datetme} </span> <br />
        {time}
      </td>
      <td className="p-2 sm:p-3">{total}</td>
      <td className="p-2 sm:p-3">
        <IconButton
          icon={EyeIconComponent}
          onClick={() => navigate(`/orders/${order._id}`)}
          ariaLabel="View Details"
        />
      </td>
    </tr>
  );
}
