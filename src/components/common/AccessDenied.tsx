import React from "react";
import { ShieldAlert } from "lucide-react";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Denied",
  message = "You do not have permission to view this content.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] sm:min-h-[70vh] bg-white px-4">
      <div className="w-full max-w-md sm:max-w-lg text-center p-6 sm:p-10 border border-red-200 rounded-2xl shadow-md bg-gradient-to-br from-white to-red-50">
        
        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
            <ShieldAlert size={28} className="text-red-600 sm:size-32" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2 tracking-wide">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
          {message}
        </p>

        {/* Footer Hint */}
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
          For access requests, please contact your administrator.
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
