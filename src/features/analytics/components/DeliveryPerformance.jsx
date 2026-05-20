import { Truck, Clock, AlertTriangle, Timer } from "lucide-react";

export default function DeliveryPerformance({ data }) {
  const metrics = [
    {
      icon: Truck,
      label: "Total Deliveries",
      value: data.totalDeliveries,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      label: "On-time Delivery",
      value: data.onTimeDelivery,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: AlertTriangle,
      label: "Late Deliveries",
      value: data.lateDeliveries,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Timer,
      label: "Avg Delivery Time",
      value: data.avgDeliveryTime,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Delivery Performance
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

