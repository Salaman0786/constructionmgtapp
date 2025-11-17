import {ArrowDownRight ,Package} from "lucide-react";

const StatusSummaryCardStockLedger = () => {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Total Stock Value</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">$31,100</h3>
          </div>
          <div className="w-10 h-10 bg-[#DBEAFE] flex items-center justify-center rounded-full">
            <Package className="text-blue-700" size={20} />
          </div>
        </div>

        {/* <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Work Progress</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">45</h3>
          </div>
          <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full">
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </div> */}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Low Stock Items</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">0</h3>
          </div>
          <div className="w-10 h-10 bg-[#FEF3C7] flex items-center justify-center rounded-full">
            <ArrowDownRight className="text-yellow-700" size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">4</h3>
          </div>
          <div className="w-10 h-10 bg-[#DCFCE7] flex items-center justify-center rounded-full">
            <Package className=" text-green-700" size={20} />
          </div>
        </div>
      </div>
  )
}

export default StatusSummaryCardStockLedger