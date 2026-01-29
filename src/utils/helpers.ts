const ADDIS_TIMEZONE = "Africa/Addis_Ababa";

//helper funtion that trims the long name into short(two words)
export const getTwoWordPreview = (name: string): string => {
  const trimmed = name.trim();

  if (trimmed.length <= 30) return trimmed; // show normally
  return trimmed.substring(0, 30) + "..."; // truncate after 30 chars
};
export const getAddisAbabaDate = (): string => {
  try {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: ADDIS_TIMEZONE,
    }); // "YYYY-MM-DD"
  } catch (err) {
    return new Date().toISOString().split("T")[0];
  }
};

export const convertToAddisDate = (isoDate?: string | null): string => {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-CA", { timeZone: ADDIS_TIMEZONE }); // "YYYY-MM-DD"
  } catch (err) {
    return isoDate.split("T")[0] || "";
  }
};

export const formatToYMD = (isoDate?: string | null): string => {
  if (!isoDate) return "";

  const datePart = isoDate.split("T")[0]; // "YYYY-MM-DD"
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`;
  }

  try {
    const d = new Date(isoDate);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${month}-${day}-${year}`;
  } catch {
    return isoDate;
  }
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

export const getExportFileName = (ext: string): string => {
  const addisDate = getAddisAbabaDate(); // YYYY-MM-DD
  const [yyyy, mm, dd] = addisDate.split("-");

  return `${mm}-${dd}-${yyyy}.${ext}`;
};

export const getInitials = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export function capitalizeWords(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(/[_\s]+/) // split by underscore or space
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
