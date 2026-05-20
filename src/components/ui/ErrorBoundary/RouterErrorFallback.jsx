import React from "react";
import { useRouteError } from "react-router-dom";
import Logo from "@/components/ui/Logo/Logo";

const RouterErrorFallback = React.memo(function RouterErrorFallback() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Logo width={56} height={56} className="h-14 w-auto mb-10" />

      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          The application encountered an unexpected error. Please reload the
          page to continue.
        </p>

        {import.meta.env.DEV && error?.message && (
          <pre className="mb-6 rounded-lg bg-gray-50 p-3 text-left text-xs text-gray-600 overflow-auto max-h-28">
            {error.message}
          </pre>
        )}

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
});

RouterErrorFallback.displayName = "RouterErrorFallback";

export default RouterErrorFallback;
