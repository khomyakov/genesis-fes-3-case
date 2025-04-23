export const API_BASE =
  // Use Vite env if provided, else fallback to localhost:8000
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  'http://localhost:8000';
