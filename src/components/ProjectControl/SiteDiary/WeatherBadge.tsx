import { CloudRain, CloudSun, Sun } from "lucide-react";
import { formatLabel } from "../../../utils/helpers";

 export const renderWeatherBadge = (weatherValue?: string) => {
  const weather = weatherValue?.toLowerCase();

  const colorClass =
    weather === "partly_cloudy"
      ? "bg-gray-100 text-gray-700"
      : weather === "sunny"
      ? "bg-yellow-100 text-yellow-700"
      : weather === "cloudy"
      ? "bg-gray-200 text-gray-700"
      : "bg-blue-100 text-blue-700";

  const Icon =
    weather === "partly_cloudy"
      ? CloudSun
      : weather === "sunny"
      ? Sun
      : weather === "cloudy"
      ? CloudRain
      : CloudRain;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      <Icon
        size={16}
        className={
          weather === "sunny"
            ? "text-yellow-500"
            : weather === "partly_cloudy"
            ? "text-gray-500"
            : weather === "cloudy"
            ? "text-gray-600"
            : "text-blue-500"
        }
      />
      {formatLabel(weatherValue)}
    </span>
  );
};
