import { Suspense } from "react";
import { Outlet, Navigate, useNavigation } from "react-router-dom";
import { isAuthenticated } from "@/helpers/auth";
import AutoSkeleton from "@/components/ui/Skeleton/AutoSkeleton";
import Loading from "@/components/ui/Loading";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SuspenseLoader = ({ children, isLoading }) => (
    <Suspense fallback={
        <AutoSkeleton loading={isLoading} config={{ animation: "pulse", borderRadius: 8 }}>
            <Outlet />
        </AutoSkeleton>
    }>
        {children}
    </Suspense>
);

export default function PublicLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    if (isAuthenticated()) {
        return <Navigate to="/select-category" replace />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <SuspenseLoader isLoading={isLoading}>
                    <Outlet />
                </SuspenseLoader>
            </main>
            <Footer />
        </div>
    );
}