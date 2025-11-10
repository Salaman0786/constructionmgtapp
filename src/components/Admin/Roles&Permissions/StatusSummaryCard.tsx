import {Shield ,Lock, Users } from "lucide-react";

const StatusSummaryCard = () => {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Totals Roles</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">3</h3>
          </div>
          <div className="w-10 h-10 bg-[#9F49EF] flex items-center justify-center rounded-full">
            <Shield  className="text-[white]" size={20} />
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
            <p className="text-sm text-gray-600">Total Users</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">4</h3>
          </div>
          <div className="w-10 h-10 bg-[#3473EF] flex items-center justify-center rounded-full">
            <Users className="text-white" size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-600">Systems Roles</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">3</h3>
          </div>
          <div className="w-10 h-10 bg-[#6464ED] flex items-center justify-center rounded-full">
            <Lock className=" text-white" size={20} />
          </div>
        </div>
      </div>
  )
}

export default StatusSummaryCard