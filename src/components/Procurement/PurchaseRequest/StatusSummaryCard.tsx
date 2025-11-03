import {Clock,CheckCircle,RefreshCw,XCircle } from "lucide-react";

const StatusSummaryCard = () => {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Pending Approval</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">12</h3>
          </div>
          <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center rounded-full">
            <Clock className="text-yellow-500" size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Work Progress</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">45</h3>
          </div>
          <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full">
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Pending PR/PO</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">38</h3>
          </div>
          <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
            <RefreshCw className="text-blue-500" size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Investor Value</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">3</h3>
          </div>
          <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded-full">
            <XCircle className="text-red-500" size={20} />
          </div>
        </div>
      </div>
  )
}

export default StatusSummaryCard