import React from "react";

interface DocumentItem {
  title: string;
  subtitle: string;
  status: "Approved" | "Pending Review" | "In Review";
}

const documents: DocumentItem[] = [
  {
    title: "Drawing Rev 3.2 - Approved",
    subtitle: "Drawing",
    status: "Approved",
  },
  {
    title: "Safety Inspection Report",
    subtitle: "Report",
    status: "Pending Review",
  },
  {
    title: "Material GRN #GRN-1045",
    subtitle: "GRN",
    status: "Approved",
  },
  {
    title: "RFI #128 - Electrical Layout",
    subtitle: "RFI",
    status: "In Review",
  },
];

const statusColors: Record<string, string> = {
  Approved: "bg-purple-100 text-purple-600",
  "Pending Review": "bg-yellow-100 text-yellow-600",
  "In Review": "bg-blue-100 text-blue-600",
};

const RecentDocuments: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Recent Documents & Approvals
      </h2>
      <p className="text-sm text-gray-500 mb-4">Latest document activity</p>

      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex justify-between items-start border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-800">{doc.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{doc.subtitle}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                statusColors[doc.status]
              }`}
            >
              {doc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;
