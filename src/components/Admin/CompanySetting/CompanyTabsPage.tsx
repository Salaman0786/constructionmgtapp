import React, { useState } from "react";

// --- Company Information Form ---
const CompanyInformationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "Addis Ababa Jamaat",
    legalName: "Addis Ababa Jamaat Construction & Development",
    registrationNumber: "REG-2024-001",
    taxId: "TAX-ETH-12345",
    email: "info@aajamaat.et",
    phone: "+251-11-123-4567",
    website: "www.aajamaat.et",
    address: "Bole Road, Addis Ababa, Ethiopia",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company Info Submitted:", formData);
  };

  return (
    <div className="bg-white w-full shadow-md rounded-xl p-6 md:p-8 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Company Information
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Company Name", name: "companyName" },
          { label: "Legal Name", name: "legalName" },
          { label: "Registration Number", name: "registrationNumber" },
          { label: "Taz ID", name: "taxId" },
          { label: "Email", name: "email" },
          { label: "Phone", name: "phone" },
          { label: "Website", name: "website" },
          { label: "Address", name: "address" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-[#313131] mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="w-full border text-[#3A3A3A] border-[#CDCDCD] bg-[#F8FAFC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
            />
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#4B0082] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#4B0082]/90 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Notification Settings ---
const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState([
    {
      id: "emailNotifications",
      title: "Email Notifications",
      description: "Receive notifications via email",
      enabled: true,
    },
    {
      id: "lowStockAlerts",
      title: "Low Stock Alerts",
      description: "Get notified when inventory is low",
      enabled: false,
    },
    {
      id: "paymentReminders",
      title: "Payment Reminders",
      description: "Reminders for pending payments",
      enabled: true,
    },
    {
      id: "projectUpdates",
      title: "Project Updates",
      description: "Notifications about project milestones",
      enabled: true,
    },
    {
      id: "systemUpdates",
      title: "System Updates",
      description: "Notifications about system maintenance",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Notification Settings:", settings);
  };

  return (
    <div className="bg-white w-full shadow-md rounded-xl p-6 md:p-8 mt-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-6 ">
    Company Information
  </h2>

  <form onSubmit={handleSubmit} className="space-y-5 ">
    {settings.map((setting) => (
      <div
        key={setting.id}
        className="flex justify-between items-center border-b border-gray-200 pb-4"
      >
        <div>
          <p className="text-sm font-medium text-[#313131]">{setting.title}</p>
          <p className="text-xs text-[#656565]">{setting.description}</p>
        </div>

        <button
          type="button"
          onClick={() => toggleSetting(setting.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            setting.enabled ? "bg-gradient-to-r from-[#A06AF9] to-[#6C47C9]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              setting.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    ))}

    <div className="flex justify-end pt-4">
      <button
        type="submit"
        className="bg-[#4B0082] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#4B0082]/90 transition-all"
      >
        Save Settings
      </button>
    </div>
  </form>
</div>

  );
};

// --- Main Tabs Component ---
const CompanyTabsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("company");

  return (
  <div className="min-h-screen w-full py-10">
  {/* Tabs */}
  <div className="w-full">
    <div className="flex w-full flex-wrap bg-white shadow-md gap-3 rounded-full p-2 overflow-hidden">
      <button
        onClick={() => setActiveTab("company")}
        className={`flex-1 text-sm md:text-base font-medium py-3 rounded-full transition-all duration-300 ${
          activeTab === "company"
            ? "bg-[#4B0082] text-white"
            : "text-[#4B0082] border-2 border-[#4B0082] hover:bg-purple-50"
        }`}
      >
        Company Information
      </button>

      <button
        onClick={() => setActiveTab("notifications")}
        className={`flex-1 text-sm md:text-base font-medium py-3 rounded-full transition-all duration-300 ${
          activeTab === "notifications"
            ? "bg-[#4B0082] text-white"
            : "text-[#4B0082] border-2 border-[#4B0082] hover:bg-purple-50"
        }`}
      >
        Notifications
      </button>
    </div>
  </div>

  {/* Tab Content */}
  <div className="w-full mt-6">
    {activeTab === "company" ? (
      <CompanyInformationForm />
    ) : (
      <NotificationSettings />
    )}
  </div>
</div>

  );
};

export default CompanyTabsPage;
