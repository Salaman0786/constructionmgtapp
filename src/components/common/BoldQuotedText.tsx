export function boldQuotedText(text: string) {
  const parts = text.split(/(".*?")/g);

  return parts.map((part, index) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      const cleanText = part.slice(1, -1); // remove starting & ending quotes
      return <strong key={index}>{cleanText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}
