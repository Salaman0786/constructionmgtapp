import React from "react";

const CompanySettingHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1 px-2">
      <div>
        <h1 className="text-lg font-semibold text-[#1E293B]">
          Company Settings
        </h1>
        <p className="text-sm text-[#64748B]">
          Manage your organization's profile and system preferences
        </p>
      </div>
    </div>
  );
};

export default CompanySettingHeader;
