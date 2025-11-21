import React from "react";

interface AlertItem {
  name: string;
  details: string;
  status: "Low" | "Critical";
}

const alerts: AlertItem[] = [
  {
    name: "Cement Bags (50kg)",
    details: "85 / 100 minimum",
    status: "Low",
  },
  {
    name: "Steel Rebar (12mm)",
    details: "45 / 75 minimum",
    status: "Critical",
  },
  {
    name: "Paint - White (5L)",
    details: "18 / 25 minimum",
    status: "Low",
  },
  {
    name: "Electrical Wire (2.5mm)",
    details: "12 / 30 minimum",
    status: "Critical",
  },
   {
    name: "Electrical Wire (2.5mm)",
    details: "12 / 30 minimum",
    status: "Critical",
  },
];

const statusColors: Record<string, string> = {
  Low: "bg-yellow-100 text-yellow-700",
  Critical: "bg-red-100 text-red-600",
};

const ReorderAlerts: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Reorder Alerts
      </h2>
      <p className="text-sm text-gray-500 mb-4">Items requiring attention</p>

      <div className="space-y-3">
        {alerts.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.details}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                statusColors[item.status]
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderAlerts;
