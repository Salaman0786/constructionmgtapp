  //helper funtion that trims the long name into short(two words)
 export const getTwoWordPreview = (name: string): string => {
    const words = name.trim().split(" ");

    if (words.length <= 3) return name; // 1 or 2 words → full
    return `${words[0]} ${words[1]} ${words[3]}...`; // more → truncate
  };

   //date fomater
 export const formatToYMD = (isoDate: string): string => {
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  };