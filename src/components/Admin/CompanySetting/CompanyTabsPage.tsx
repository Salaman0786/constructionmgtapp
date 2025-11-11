import React, { useEffect, useRef, useState } from "react";
import {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUpdateNotificationSettingsMutation,
} from "../../../features/companySettings/api/companySettingsApi";
import { showError, showSuccess } from "../../../utils/toast";
import { UploadCloud } from "lucide-react";

// --- Company Information Form ---
const CompanyInformationForm: React.FC = () => {
  const { data, isLoading, refetch } = useGetCompanySettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateCompany, { isLoading: isSaving }] =
    useUpdateCompanySettingsMutation();

  const [formData, setFormData] = useState({
    companyName: "",
    legalName: "",
    registrationNumber: "",
    taxId: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    companyLogo: null as File | null,
    companyLogoUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.data) {
      const c = data.data;
      setFormData({
        companyName: c.companyName,
        legalName: c.legalName,
        registrationNumber: c.registrationNumber,
        taxId: c.taxId,
        email: c.email,
        phone: c.phone,
        website: c.website,
        address: c.address,
        companyLogo: null,
        companyLogoUrl: c.companyLogo || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file upload and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        companyLogo: file,
        companyLogoUrl: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Drag-and-drop support fix (prevents image opening in new tab)
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        companyLogo: file,
        companyLogoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // prevent browser from opening file
  };

  // 💾 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "companyLogo" && value !== null) {
        payload.append("file", value as any); // ✅ correct key
      } else if (key !== "companyLogoUrl" && value !== null) {
        payload.append(key, value as any);
      }
    });

    try {
      await updateCompany(payload).unwrap();
      showSuccess("Company details updated successfully!");
      refetch();
    } catch (err: any) {
      showError(err?.data?.message || "Failed to update company details!");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-[#4B0082] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 mt-4">
          Loading company information...
        </p>
      </div>
    );

  return (
    <div className="bg-white w-full shadow-md rounded-xl p-6 md:p-8 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Company Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* 🔹 Company Info Fields */}
        {[
          { label: "Company Name", name: "companyName" },
          { label: "Legal Name", name: "legalName" },
          { label: "Registration Number", name: "registrationNumber" },
          { label: "Tax ID", name: "taxId" },
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
              value={(formData as any)[field.name] || ""}
              onChange={handleChange}
              className="w-full border text-[#3A3A3A] border-[#CDCDCD] bg-[#F8FAFC] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
            />
          </div>
        ))}

        {/* 🖼️ Logo Upload Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#313131] mb-1">
            Company Logo
          </label>

          {/* ✅ Logo Preview */}
          {formData.companyLogoUrl && (
            <div className="flex justify-center mb-3">
              <img
                src={formData.companyLogoUrl}
                alt="Company Logo Preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* ✅ Drag & Drop + Click Upload Area */}
          <label
            htmlFor="companyLogo"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-[#F8FAFC] py-10 cursor-pointer hover:bg-gray-50 transition"
          >
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center text-sm">
              Drop your logo here, or click to browse
            </p>
            <span className="text-purple-700 text-sm font-medium mt-2">
              Upload Logo
            </span>
          </label>

          {/* Hidden File Input */}
          <input
            id="companyLogo"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* 💾 Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#4B0082] text-white font-medium px-6 py-2 rounded-lg 
               hover:bg-[#4B0082]/90 transition-all
               disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Notification Settings ---
const NotificationSettings: React.FC = () => {
  const { data, refetch } = useGetCompanySettingsQuery(undefined, {
    refetchOnMountOrArgChange: true, // ✅ auto refresh after save
  });
  const [updateNotifications, { isLoading }] =
    useUpdateNotificationSettingsMutation();

  const [settings, setSettings] = useState({
    emailNotification: false,
    lowStockAlert: false,
    paymentReminder: false,
    projectUpdate: false,
    systemUpdate: false,
  });

  // ✅ Set initial state from API
  useEffect(() => {
    if (data?.data?.notification) {
      const n = data.data.notification;
      setSettings({
        emailNotification: n.emailNotification,
        lowStockAlert: n.lowStockAlert,
        paymentReminder: n.paymentReminder,
        projectUpdate: n.projectUpdate,
        systemUpdate: n.systemUpdate,
      });
    }
  }, [data]);

  // ✅ Toggle each setting
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotifications(settings).unwrap();
      showSuccess("Notification preferences updated!");
      refetch();
    } catch {
      showError("Failed to update notification preferences!");
    }
  };

  // ✅ Display settings with labels and descriptions
  const settingLabels: Record<
    keyof typeof settings,
    { title: string; description: string }
  > = {
    emailNotification: {
      title: "Email Notifications",
      description: "Receive notifications via email",
    },
    lowStockAlert: {
      title: "Low Stock Alerts",
      description: "Get notified when inventory is low",
    },
    paymentReminder: {
      title: "Payment Reminders",
      description: "Reminders for pending payments",
    },
    projectUpdate: {
      title: "Project Updates",
      description: "Notifications about project milestones",
    },
    systemUpdate: {
      title: "System Updates",
      description: "Notifications about system maintenance",
    },
  };

  return (
    <div className="bg-white w-full shadow-md rounded-xl p-6 md:p-8 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Company Information
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        {Object.entries(settings).map(([key, value]) => {
          const { title, description } =
            settingLabels[key as keyof typeof settings];
          return (
            <div
              key={key}
              className="flex justify-between items-center border-b border-gray-200 pb-4"
            >
              <div>
                <p className="text-sm font-medium text-[#313131]">{title}</p>
                <p className="text-xs text-[#656565]">{description}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleSetting(key as keyof typeof settings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value
                    ? "bg-gradient-to-r from-[#A06AF9] to-[#6C47C9]"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          );
        })}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#4B0082] text-white font-medium px-6 py-2 rounded-lg 
               hover:bg-[#4B0082]/90 transition-all
               disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Settings"}
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
