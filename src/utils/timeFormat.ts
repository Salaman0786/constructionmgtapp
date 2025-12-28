export function timeFormat(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  const now = Date.now();

  const diffMs = now - created;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")} hr ago`;
}
