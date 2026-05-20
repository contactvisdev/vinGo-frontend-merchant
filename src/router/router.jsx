import React, { Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import lazyWithRetry from "@/helpers/lazyWithRetry";
import {
  PublicRoutes,
  PrivateRoutes,
  OnboardingRoutes,
  LandingPageRoutes,
} from "./routes";
import DashboardLayout from "@/components/layouts/DashboardLayout/DashboardLayout";
import PublicLayout from "@/components/layouts/PublicLayout/PublicLayout";

const TermsOfService = lazyWithRetry(
  () => import("@/features/onboarding-v2/components/TermsOfService"),
);
import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import OnboardingLayout from "@/components/layouts/OnboardingLayout/OnboardingLayout";
import PermissionDenied from "@/components/PermissionDenied";
import { getFirstPermittedRoute } from "@/router/getFirstPermittedRoute";
import { isAuthenticated } from "@/helpers/auth";
import { hasPermission } from "@/helpers/permissions";
import Loading from "@/components/ui/Loading";
import {
  PageErrorFallback,
  RouterErrorFallback,
} from "@/components/ui/ErrorBoundary";

const SuspenseLoader = ({ children }) => (
  <ErrorBoundary FallbackComponent={PageErrorFallback}>
    {/* <Suspense fallback={<Loading />}>{children}</Suspense> */}
    {children}{" "}
  </ErrorBoundary>
);

const routeMatchers = PrivateRoutes.map((route) => ({
  ...route,
  regex: new RegExp(`^${route.path.replace(/:[^/]+/g, "[^/]+")}$`),
}));

const ProtectedLayout = () => {
  const location = useLocation();

  const currentRoute = routeMatchers.find(
    (route) =>
      route.regex.test(location.pathname) || route.path === location.pathname,
  );

  const title = currentRoute?.title || currentRoute?.name || "";
  const subtitle = currentRoute?.subtitle || "";
  const breadcrumb = currentRoute?.breadcrumb || null;

  const profile = useSelector((state) => state?.ownerProfile?.profile);
  const isProfileCompleted = useSelector(
    (state) => state?.businessProfile?.profile?.isProfileCompleted,
  );
  const isDocumentVerified = useSelector(
    (state) => state?.businessProfile?.profile?.isDocumentVerified,
  );
  const hasProfile = useSelector((state) => {
    const p = state?.businessProfile?.profile;
    return !!p && Object.keys(p).length > 0;
  });

  const permissionMeta = currentRoute?.meta?.permission;
  const hasAccess =
    !permissionMeta ||
    hasPermission(profile, permissionMeta.module, permissionMeta.action);
  const firstPermittedPath = getFirstPermittedRoute(profile);
  const shouldRedirectToPermitted =
    !hasAccess &&
    firstPermittedPath &&
    location.pathname !== firstPermittedPath;

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/login" replace />;
  }

  if (isProfileCompleted === false) {
    return <Navigate to="/select-category" replace />;
  }

  if (isProfileCompleted === true && isDocumentVerified === true) {
    if (shouldRedirectToPermitted) {
      return <Navigate to={firstPermittedPath} replace />;
    }
    return (
      <DashboardLayout
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
      >
        {hasAccess ? <Outlet /> : <PermissionDenied />}
      </DashboardLayout>
    );
  }
  return <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <RouterErrorFallback />,
    children: PublicRoutes.map((route) => ({
      path: route.path,
      element: (
        <SuspenseLoader>
          <route.component />
        </SuspenseLoader>
      ),
    })),
  },
  {
    element: <OnboardingLayout />,
    errorElement: <RouterErrorFallback />,
    children: OnboardingRoutes.map((route) => ({
      path: route.path,
      element: (
        <SuspenseLoader>
          <route.component {...(route.props || {})} />
        </SuspenseLoader>
      ),
    })),
  },
  {
    element: <ProtectedLayout />,
    errorElement: <RouterErrorFallback />,
    children: PrivateRoutes.map((route) => ({
      path: route.path,
      element: (
        <SuspenseLoader>
          <route.component />
        </SuspenseLoader>
      ),
    })),
  },

  {
    element: <PublicLayout />,
    errorElement: <RouterErrorFallback />,
    children: LandingPageRoutes.map((route) => ({
      path: route.path,
      element: (
        <SuspenseLoader>
          <route.component />
        </SuspenseLoader>
      ),
    })),
  },

  {
    path: "/termsofservice",
    element: (
      <SuspenseLoader>
        <TermsOfService />
      </SuspenseLoader>
    ),
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
