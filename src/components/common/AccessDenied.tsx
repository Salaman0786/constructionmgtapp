import React from "react";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Denied 🚫",
  message = "You do not have permission to view this content.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center px-8 py-10 bg-red-50 border border-red-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
