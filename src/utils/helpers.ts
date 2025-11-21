//helper funtion that trims the long name into short(two words)
export const getTwoWordPreview = (name: string): string => {
  const trimmed = name.trim();

  if (trimmed.length <= 30) return trimmed; // show normally
  return trimmed.substring(0, 30) + "..."; // truncate after 30 chars
};

//date fomater
export const formatToYMD = (isoDate: string): string => {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//label formatter
export const formatLabel = (value?: string) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

//calculate progress using start and end date
export const calculateProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const today = new Date().getTime();

  if (today <= start) return 0;
  if (today >= end) return 100;

  const progress = ((today - start) / (end - start)) * 100;
  return Math.round(progress);
};
