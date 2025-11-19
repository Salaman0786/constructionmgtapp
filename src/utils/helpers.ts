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
