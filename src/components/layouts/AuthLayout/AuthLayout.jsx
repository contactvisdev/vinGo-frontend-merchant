import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "@/helpers/auth";
import Topbar from "./Topbar";
import Navbar from "../PublicLayout/Navbar";
import Loading from "@/components/ui/Loading";

ReactDOM.preload("/images/bg-image.webp", { as: "image", fetchPriority: "high" });

const SuspenseLoader = ({ children }) => (
    <Suspense fallback={<Loading />}>
        {children}
    </Suspense>
);

export default function AuthLayout() {

    const token = isAuthenticated();
    if (token) {
        return <Navigate to="/select-category" replace />;
    }

    return (
        <div>
            <Topbar isauthenticated={!!token} />
            <main>
                <SuspenseLoader>
                    <Outlet />
                </SuspenseLoader>
            </main>
        </div>
    );
}
