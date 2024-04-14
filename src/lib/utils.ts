import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* function that merges and applies CSS class names 
whilst combining the utility of Tailwind CSS */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
