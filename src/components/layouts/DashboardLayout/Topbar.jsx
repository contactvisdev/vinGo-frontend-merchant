import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, Wallet as WalletIcon } from "lucide-react";
import { markAllRead } from "@/store/notificationSlice";
import { notificationService } from "@/services/notificationService";
import { useGetWalletByUserQuery } from "@/store/api/walletApi";
import MerchantSwitcher from "./MerchantSwitcher";

const formatCurrency = (value, currency = "USD") => {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `$${safe.toFixed(2)}`;
  }
};

const formatTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const Topbar = React.memo(({ setSidebarOpen, handleLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const hasUnread = useSelector((state) => state.notification.hasUnread);
  const unreadCount = useSelector((state) => state.notification.unreadCount);
  const notifications = useSelector(
    (state) => state.notification.notifications,
  );
  const userName = useSelector(
    (state) =>
      state?.ownerProfile?.profile?.ownerName ??
      state?.ownerProfile?.profile?.name ??
      "",
  );
  const merchantId = useSelector(
    (state) => state?.businessProfile?.profile?._id,
  );
  const businessName = useSelector(
    (state) => state?.businessProfile?.profile?.business?.businessName ?? "",
  );
  const selfieUrl = useSelector(
    (state) => state?.businessProfile?.profile?.ownerVerification?.selfieUrl,
  );

  const { data: wallet } = useGetWalletByUserQuery(
    { userId: merchantId, userType: "MERCHANT" },
    { skip: !merchantId },
  );
  const walletBalance = wallet?.balance ?? 0;
  const walletCurrency = wallet?.currency || "USD";

  const handleWalletClick = useCallback(() => {
    navigate("/finance/wallet");
  }, [navigate]);

  const initials = userName.trim()
    ? userName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
    : "NA";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotifOpen((prev) => {
      const opening = !prev;
      if (opening && hasUnread && merchantId) {
        notificationService
          .markAllRead(merchantId)
          .then(() => dispatch(markAllRead()))
          .catch(() => {});
      }
      return opening;
    });
  }, [hasUnread, dispatch, merchantId]);

  const handleLogoutClick = useCallback(() => {
    handleLogout();
    setDropdownOpen(false);
  }, [handleLogout]);

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label="Toggle navigation menu"
          onClick={setSidebarOpen}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {businessName && (
          <span className="text-[22px] font-semibold text-gray-800 truncate mr-4 min-w-0">
            {businessName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={handleWalletClick}
          aria-label="Wallet"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors border border-primary-100"
        >
          <WalletIcon size={18} className="text-primary" />
          <span className="text-sm font-semibold text-primary-700">
            {formatCurrency(walletBalance, walletCurrency)}
          </span>
        </button>

        <div className="relative" ref={notifRef}>
          <button
            aria-label="Notifications"
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell size={22} fill="black" className="text-black" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-gray-500">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif._id}
                      type="button"
                      onClick={() => {
                        if (
                          notif?.url &&
                          typeof notif.url === "string" &&
                          notif.url.startsWith("/") &&
                          !/^\/\//.test(notif.url)
                        ) {
                          setNotifOpen(false);
                          navigate(notif.url);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notif.isRead ? "bg-primary-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {notif.message}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <MerchantSwitcher />

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center gap-3">
            {selfieUrl ? (
              <img
                src={selfieUrl}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{initials}</span>
              </div>
            )}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Topbar.displayName = "Topbar";

export default Topbar;
