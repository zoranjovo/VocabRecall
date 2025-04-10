export function timeUntil(dateStr: string | undefined): string {
  if(!dateStr || dateStr == undefined){ return '?'; }
  const date = new Date(dateStr);
  const now: Date = new Date();
  const diff: number = date.valueOf() - now.valueOf();
  if (diff <= 0) return "Now";

  const seconds: number = Math.round(diff / 1000);
  const minutes: number = Math.round(seconds / 60);
  const hours: number = Math.round(minutes / 60);
  const days: number = Math.round(hours / 24);

  if (seconds < 60) return `in ${seconds} secs`;
  if (minutes < 60) return `in ${minutes} mins`;
  if (hours < 24) return `in ${hours} hrs`;
  return `in ${days} days`;
}

export function timeSince(dateStr: string | undefined): string {
  if(!dateStr || dateStr == undefined){ return '?'; }
  const date = new Date(dateStr);
  const now: Date = new Date();
  const diff: number = now.valueOf() - date.valueOf();
  if (diff <= 0) return "Now";

  const seconds: number = Math.round(diff / 1000);
  const minutes: number = Math.round(seconds / 60);
  const hours: number = Math.round(minutes / 60);
  const days: number = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} secs ago`;
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return `${days} days ago`;
}