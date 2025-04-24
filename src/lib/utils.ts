import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// If same audio uploaded multiple times, it will have the same filename/instance on Backend, therefore 500 error when removing the audio file from the second track
// This function generates a random filename to avoid conflict
export const randomFilename = (original: string) => {
  const uid = crypto.getRandomValues(new Uint32Array(1))[0]
    .toString(16)
    .padStart(8, '0');

  const dot = original.lastIndexOf('.');
  const base = dot === -1 ? original : original.slice(0, dot);
  const ext  = dot === -1 ? '' : original.slice(dot);

  return `${base}_${uid}${ext}`;
};