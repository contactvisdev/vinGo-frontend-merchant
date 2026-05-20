import { useState } from "react";
import BaseCard from "@/components/ui/Card/Card";
import { CustomToggle } from "@/components/forms/CustomToggle";

const Row = ({ title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <div className="font-medium text-sm">{title}</div>
      {desc && <div className="text-xs text-gray-400 mt-1">{desc}</div>}
    </div>

    <div>
      <CustomToggle checked={checked} onChange={onChange} />
    </div>
  </div>
);

export default function Notification() {
  const [state, setState] = useState({
    newOrderAlerts: true,
    orderStatusUpdates: true,
    paymentConfirmations: false,
    newReviews: true,
    systemMaintenance: false,
    securityAlerts: false,
  });

  const toggle = (key) => {
    setState((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="p-4">
      <BaseCard title="Order Notifications" extraClassName="p-6">
        <Row
          title="New Order Alerts"
          desc="Get Notifies when new order are placed"
          checked={state.newOrderAlerts}
          onChange={() => toggle("newOrderAlerts")}
        />

        <Row
          title="Order Status Updates"
          desc="Notification when order status changes"
          checked={state.orderStatusUpdates}
          onChange={() => toggle("orderStatusUpdates")}
        />

        <Row
          title="Payment Confirmations"
          desc="Alerts for Successful payments"
          checked={state.paymentConfirmations}
          onChange={() => toggle("paymentConfirmations")}
        />
        <p className={`block text-black font-semibold mt-6 mb-2 text-2xl`}>
          Customer Communications
        </p>
        <Row
          title="New Reviews"
          desc="Notification for customer reviews"
          checked={state.newReviews}
          onChange={() => toggle("newReviews")}
        />
        <p className={`block text-black font-semibold mt-6 mb-2 text-2xl`}>
          System Alerts
        </p>
        <Row
          title="System Maintenance"
          desc="Scheduled maintenance notifications"
          checked={state.systemMaintenance}
          onChange={() => toggle("systemMaintenance")}
        />

        <Row
          title="Security Alerts"
          desc="Account security notifications"
          checked={state.securityAlerts}
          onChange={() => toggle("securityAlerts")}
        />
      </BaseCard>
    </div>
  );
}

