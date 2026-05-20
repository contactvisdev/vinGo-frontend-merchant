import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "@/store";
import { logout, isAuthenticated } from "@/helpers/auth";
import { connectSocket, disconnectSocket } from "@/services/socket";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Get merchant ID from store
  const profile = useSelector((state) => state?.businessProfile?.profile);
  const merchantId = profile?._id;

  const token = useMemo(() => isAuthenticated(), []);

  useEffect(() => {
    if (token) {
      connectSocket(token, merchantId);
    }
    return () => disconnectSocket();
  }, [token, merchantId]);

  const handleLogout = useCallback(
    async (e) => {
      e?.preventDefault();
      disconnectSocket();
      await logout(
        () => {
          navigate("/", { replace: true });
        },
        dispatch,
        persistor,
      );
    },
    [navigate, dispatch],
  );

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs z-30 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Topbar
          setSidebarOpen={() => setSidebarOpen(true)}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto px-8 py-4 custom-menu">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
