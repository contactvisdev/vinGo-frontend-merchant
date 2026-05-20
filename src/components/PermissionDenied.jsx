import React from "react";
import { ShieldX } from "lucide-react";

export default function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 max-w-md">
        You do not have enough permissions to access this page.
      </p>
    </div>
  );
}
