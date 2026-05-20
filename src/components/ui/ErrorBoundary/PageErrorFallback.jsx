import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageErrorFallback = React.memo(function PageErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <AlertTriangle className="h-8 w-8 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred while loading this page. You can try
          again or go back to the dashboard.
        </p>

        {import.meta.env.DEV && error?.message && (
          <pre className="mb-6 rounded-lg bg-gray-50 p-3 text-left text-xs text-gray-600 overflow-auto max-h-28">
            {error.message}
          </pre>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
});

PageErrorFallback.displayName = "PageErrorFallback";

export default PageErrorFallback;
