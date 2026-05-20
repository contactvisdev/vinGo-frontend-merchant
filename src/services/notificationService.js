import api from "@/services/helper/client";
import endPoints from "@/services/helper/endpoints";

export const notificationService = {
  async markAllRead(merchantId, { signal } = {}) {
    return api("patch", endPoints.NOTIFICATION_READ_ALL, {}, {
      recipientType: "merchant",
      recipientId: merchantId,
    }, { signal });
  },
};
