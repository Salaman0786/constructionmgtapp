export const TaskSkeleton = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gray-200"></div>
        <div className="h-3 bg-gray-200 w-20 rounded"></div>
      </div>
      <div className="h-3 bg-gray-200 w-12 rounded"></div>
    </div>

    <div className="flex items-center justify-between mb-3">
      <div className="h-4 bg-gray-200 w-14 rounded"></div>
      <div className="h-4 bg-gray-200 w-10 rounded"></div>
    </div>

    <div className="w-full bg-gray-200 h-2 rounded-full"></div>
  </div>
);
