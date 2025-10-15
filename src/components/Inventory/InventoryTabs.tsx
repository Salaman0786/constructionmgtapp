import React, { useState } from "react";
import { UsersTable } from "../AdminPanel/UsersTable";
import { RolesTable } from "../AdminPanel/RolesTable";
import { CurrentInventory } from "./CurrentInventory";
import { TransactionInventory } from "./TransactionInventory";

type Tab = "user" | "role";

const InventoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("user");

  return (
    <div className="py-6">
      {/* Tabs */}
      <div className="flex gap-2  mb-4">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "user"
              ? "bg-gray-100 border border-gray-300 text-gray-900 "
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Current Inventory
        </button>
        <button
          onClick={() => setActiveTab("role")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "role"
              ? "bg-gray-100 border border-gray-300 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Transaction History
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {activeTab === "user" ? <CurrentInventory /> : <TransactionInventory />}
      </div>
    </div>
  );
};

export default InventoryTabs;
