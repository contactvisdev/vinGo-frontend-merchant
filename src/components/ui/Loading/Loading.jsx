import React from 'react';

const Loading = React.memo(function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-100">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-primary border-transparent rounded-full animate-spin"></div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-neutral-700">Loading</p>
        <div className="mt-2 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
});

Loading.displayName = "Loading";

export default Loading;