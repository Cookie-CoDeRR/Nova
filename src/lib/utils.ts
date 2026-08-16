import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getHoursRemaining(dueDate: Date | string): number {
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.round((due - now) / (1000 * 60 * 60)));
}
