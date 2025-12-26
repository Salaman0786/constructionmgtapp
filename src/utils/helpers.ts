const ADDIS_TIMEZONE = "Africa/Addis_Ababa";

//helper funtion that trims the long name into short(two words)
export const getTwoWordPreview = (name: string): string => {
  const trimmed = name.trim();

  if (trimmed.length <= 30) return trimmed; // show normally
  return trimmed.substring(0, 30) + "..."; // truncate after 30 chars
};

/**
 * Return current date in Addis Ababa as "YYYY-MM-DD".
 * Use this when creating new records so date is always Addis date.
 */
export const getAddisAbabaDate = (): string => {
  try {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: ADDIS_TIMEZONE,
    }); // "YYYY-MM-DD"
  } catch (err) {
    return new Date().toISOString().split("T")[0];
  }
};

/**
 * Convert a backend ISO datetime/string to Addis Ababa date string "YYYY-MM-DD".
 * Accepts ISO like "2025-12-11T10:20:30Z" or "2025-12-11".
 */
export const convertToAddisDate = (isoDate?: string | null): string => {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-CA", { timeZone: ADDIS_TIMEZONE }); // "YYYY-MM-DD"
  } catch (err) {
    return isoDate.split("T")[0] || "";
  }
};

/**
 * Safe formatter for display: accepts an ISO-like date or datetime string and returns "MM-DD-YYYY".
 * NOTE: This is string-based when possible so timezone shifts don't change the day.
 *
 * Examples:
 *  - input "2025-12-11T10:20:30Z"  -> returns "12-11-2025"
 *  - input "2025-12-11"           -> returns "12-11-2025"
 */
export const formatToYMD = (isoDate?: string | null): string => {
  if (!isoDate) return "";
  // Prefer to parse the YYYY-MM-DD portion directly (safe against TZ shifts).
  const datePart = isoDate.split("T")[0]; // "YYYY-MM-DD"
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`;
  }

  // Fallback: try Date object formatting (less ideal)
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
