import { io } from "socket.io-client";
import { store } from "@/store";
import {
  addNotification,
  setNotifications,
  setUnreadCount,
} from "@/store/notificationSlice";
import { apiSlice } from "@/store/api/apiSlice";
import { isAuthenticated } from "@/helpers/auth";

const NOTIFICATION_URL = import.meta.env.VITE__NOTIFICATION_URL;

const ORDER_REFRESH_TYPES = new Set([
  "NEW_ORDER",
  "DRIVER_ASSIGNED",
  "DRIVER_AT_RESTAURANT",
  "ORDER_PICKED_UP",
  "ORDER_REACHED_DROP",
  "ORDER_DELIVERED",
]);

const WALLET_REFRESH_TYPES = new Set([
  "ORDER_DELIVERED",
]);

let socket = null;
let hasReceivedInitialNotifications = false;

export const connectSocket = (token, merchantId = null) => {
  if (!NOTIFICATION_URL?.trim()) {
    return;
  }

  if (socket?.connected) {
    return;
  }

  const authToken = token ?? isAuthenticated();
  if (!authToken) {
    return;
  }

  if (!merchantId) return;
  const merchantIdToUse = merchantId;

  const isNgrok = NOTIFICATION_URL.includes("ngrok");

  const socketOptions = {
    auth: {
      token: authToken,
      merchantId: merchantIdToUse,
    },
    transports: isNgrok ? ["websocket", "polling"] : ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
    ...(isNgrok && {
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    }),
    forceNew: true,
  };

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  socket = io(NOTIFICATION_URL, socketOptions);

  socket.on("connect", () => {
    hasReceivedInitialNotifications = false;
  });

  socket.on("notification:update", (data) => {
    if (data?.notifications && Array.isArray(data.notifications)) {
      if (!hasReceivedInitialNotifications) {
        store.dispatch(setNotifications(data.notifications));
        hasReceivedInitialNotifications = true;
      } else {
        [...data.notifications].reverse().forEach((notification) => {
          if (notification?._id) {
            store.dispatch(addNotification(notification));
          }
        });
      }
    }

    if (
      data?.notification &&
      typeof data.notification === "object" &&
      data.notification._id
    ) {
      store.dispatch(addNotification(data.notification));
    }

    if (typeof data?.unreadCount === "number") {
      store.dispatch(setUnreadCount(data.unreadCount));
    }

    const notifications =
      data?.notifications || (data?.notification ? [data.notification] : []);
    const orderIdsToRefresh = new Set();
    let hasNewOrder = false;
    for (const notification of notifications) {
      if (
        notification?.type &&
        ORDER_REFRESH_TYPES.has(notification.type) &&
        notification.referenceId
      ) {
        orderIdsToRefresh.add(notification.referenceId);
        if (notification.type === "NEW_ORDER") {
          hasNewOrder = true;
        }
      }
    }
   if (orderIdsToRefresh.size > 0) {
      const tags = [];
      for (const orderId of orderIdsToRefresh) {
        tags.push({ type: "Order", id: orderId });
      }
      if (hasNewOrder) {
        tags.push({ type: "Order", id: "LIST" });
      }
      store.dispatch(apiSlice.util.invalidateTags(tags));
    }

    const shouldRefreshWallet = notifications.some(
      (n) => n?.type && WALLET_REFRESH_TYPES.has(n.type)
    );
    if (shouldRefreshWallet) {
      store.dispatch(
        apiSlice.util.invalidateTags([{ type: "Wallet", id: "LIST" }])
      );
    }
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (err) => {
    if (import.meta.env.DEV) {
      console.error("[Socket] Connection error:", {
        message: err.message,
        type: err.type,
        description: err.description,
      });
    }

    if (err.data) {
      if (import.meta.env.DEV) {
        console.error("[Socket] Error data:", err.data);
      }
    }
  });

  socket.on("reconnect", () => {
    if (import.meta.env.DEV) console.log("[Socket] Reconnected successfully");
  });

  socket.on("reconnect_attempt", () => {
    if (import.meta.env.DEV) console.log("[Socket] Reconnection attempt");
  });

  socket.on("reconnect_error", (error) => {
    if (import.meta.env.DEV) {
      console.error("[Socket]  Reconnection error:", error.message);
    }
  });

  socket.on("reconnect_failed", () => {
    if (import.meta.env.DEV) {
      console.error("[Socket]  Reconnection failed after all attempts");
    }
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    hasReceivedInitialNotifications = false;
  }
};

export const getSocket = () => socket;
