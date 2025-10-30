import React from "react";
import {
  Folder,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowDown,
  ArrowUp,
  FileText,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subText,
  icon,
  iconBg,
  valueColor,
}) => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl shadow-sm p-5 bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
      </div>

      <h2
        className={`text-2xl font-semibold mt-2 ${
          valueColor ?? "text-gray-900"
        }`}
      >
        {value}
      </h2>

      {subText && <p className="text-sm text-gray-500 mt-1">{subText}</p>}
    </div>
  );
};

const DashboardHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        Dashboard Overview
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Complete overview of project progress & financial metrics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value="24"
          subText="4 Active | 8 Planning | 12 Complete"
          icon={<Folder className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Work Progress"
          value="67%"
          subText={
            <span className="text-green-600 font-medium">+5% this week</span>
          }
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Pending PR/PO"
          value="18"
          subText="12 PR | 6 PO awaiting approval"
          icon={<Clock className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Investor Value"
          value="$1.8M"
          subText="8 items below reorder"
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Accounts Receivable"
          value="$456K"
          subText="23 outstanding invoices"
          icon={<ArrowDown className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Accounts Payable"
          value="$312K"
          subText="15 vendor bills pending"
          icon={<ArrowUp className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Cash Inflow (MTD)"
          value="$625K"
          subText={
            <span className="text-green-600 font-medium">
              +18% from last month
            </span>
          }
          icon={<FileText className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Cash Outflow (MTD)"
          value="$438K"
          subText={
            <span className="text-red-600 font-medium">
              +8% from last month
            </span>
          }
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
          valueColor="text-red-600"
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
