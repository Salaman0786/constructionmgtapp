export const StatCardShimmer = () => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl shadow-sm p-5 bg-white animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
      </div>

      <div className="h-8 w-20 bg-gray-200 rounded mt-4"></div>
      <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
    </div>
  );
};
