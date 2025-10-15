import React, { useState } from "react";
import { CurrentInventory } from "../Inventory/CurrentInventory";
import { TransactionInventory } from "../Inventory/TransactionInventory";
import AccountsRec from "./AccountsRec/AccountsRec";
import AccountsPay from "./AccountsPay/AccountsPay";
import Inventory from "./Inventory/Inventory";
import ForeignExchange from "./ForeignExchange/ForeignExchange";

type Tab =
  | "accountsReceivable"
  | "accountsPayable"
  | "foreignExchange"
  | "inventory";

const ReportsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("accountsReceivable");

  return (
    <div className="py-6">
      {/* Tabs */}
      <div className="flex gap-2  mb-4">
        <button
          onClick={() => setActiveTab("accountsReceivable")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "accountsReceivable"
              ? "bg-gray-100 border border-gray-300 text-gray-900 "
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Accounts Receivable
        </button>
        <button
          onClick={() => setActiveTab("accountsPayable")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "accountsPayable"
              ? "bg-gray-100 border border-gray-300 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Accounts Payable
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "inventory"
              ? "bg-gray-100 border border-gray-300 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab("foreignExchange")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "foreignExchange"
              ? "bg-gray-100 border border-gray-300 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Foreign Exchange
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {activeTab === "accountsReceivable" ? (
          <AccountsRec />
        ) : activeTab === "accountsPayable" ? (
          <AccountsPay />
        ) : activeTab === "inventory" ? (
          <Inventory />
        ) : activeTab === "foreignExchange" ? (
          <ForeignExchange />
        ) : (
          <div className="p-4 text-gray-500">Select a tab to view data</div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
