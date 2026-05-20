import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    hasUnread: false,
    unreadCount: 0,
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const notif = action.payload;
      const exists = state.notifications.some((n) => n._id === notif._id);
      if (!exists) {
        state.notifications.unshift(notif);
      }
    },
    setNotifications: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload : [];
      state.notifications = [...list].sort((a, b) => {
        const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    },
    markAllRead: (state) => {
      state.hasUnread = false;
      state.unreadCount = 0;
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },
    setHasUnread: (state, action) => {
      state.hasUnread = !!action.payload;
    },
    setUnreadCount: (state, action) => {
      const count = Math.max(0, Number(action.payload) ?? 0);
      state.unreadCount = count;
      state.hasUnread = count > 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.hasUnread = false;
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  markAllRead,
  setHasUnread,
  setUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
