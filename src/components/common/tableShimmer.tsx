 export const renderShimmer = () => (
    <tr>
      <td colSpan={13} className="p-3">
        <div className="animate-pulse space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </td>
    </tr>
  );
