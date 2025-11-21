import { formatLabel } from "../../../utils/helpers";

interface Props {
  status?: string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-blue-100 text-blue-600";
      case "ONGOING":
        return "bg-green-100 text-green-600";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
        status
      )}`}
    >
      {formatLabel(status)}
    </span>
  );
};
