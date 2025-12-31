export default function AuditLogShimmer({ count = 6 }: { count?: number }) {
  return (
    <div className="relative space-y-6">
      {/* Vertical line */}
      <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-gray-200" />

      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="relative pl-10 sm:pl-14">
          {/* Icon shimmer */}
          <div className="absolute left-1.5 sm:left-2 top-5
            w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 animate-pulse"
          />

          {/* Card shimmer */}
          <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

            {/* Meta */}
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />

            {/* Entity badge */}
            <div className="h-5 w-16 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
