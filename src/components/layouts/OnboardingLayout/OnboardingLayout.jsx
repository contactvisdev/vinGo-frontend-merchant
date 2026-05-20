import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticated } from "@/helpers/auth";
import { getFirstPermittedRoute } from "@/router/getFirstPermittedRoute";
import Topbar from "@/components/layouts/AuthLayout/Topbar";
import Loading from "@/components/ui/Loading";

const SuspenseLoader = ({ children }) => (
    <Suspense fallback={<Loading />}>
        {children}
    </Suspense>
);

export default function OnboardingLayout() {
    const profile = useSelector((state) => state?.businessProfile?.profile);
    const ownerProfile = useSelector((state) => state?.ownerProfile?.profile);
    const token = isAuthenticated();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (profile?.isProfileCompleted) {
        const firstPermittedPath = getFirstPermittedRoute(ownerProfile);
        return <Navigate to={firstPermittedPath} replace />;
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