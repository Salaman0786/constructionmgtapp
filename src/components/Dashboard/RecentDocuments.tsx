import React from "react";
import { DocumentShimmer } from "./CommonShimmer";
import { formatLabel } from "../../utils/helpers";
interface ApiDocument {
  id: string;
  drawingName: string;
  drawingCode: string;
  description: string;
  createdAt: string;
  // status?: "Approved" | "Pending Review" | "In Review";
}

interface Props {
  documents?: ApiDocument[];
  isLoading?: boolean;
}

// const statusColors: Record<string, string> = {
//   Approved: "bg-purple-100 text-purple-600",
//   "Pending Review": "bg-yellow-100 text-yellow-600",
//   "In Review": "bg-blue-100 text-blue-600",
// };

const RecentDocuments: React.FC<Props> = ({ documents, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Recent Documents
      </h2>
      <p className="text-sm text-gray-500 mb-4">Latest document activity</p>

      {/* ✅ min height fix */}
      <div className={`space-y-5 min-h-[200px] flex flex-col ${
          !isLoading && (!documents|| documents.length === 0)
            ? "justify-center"
            : "justify-start"
        }`}>
        {isLoading ? (
          [...Array(5)].map((_, i) => <DocumentShimmer key={i} />)
        ) : documents && documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-start border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {formatLabel(doc.drawingName)}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{doc.drawingCode}</p>
              </div>

              {/* {doc.status && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    statusColors[doc.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {doc.status}
                </span>
              )} */}
            </div>
          ))
        ) : (
          /* ✅ Empty state centered but height preserved */
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No recent documents found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDocuments;
