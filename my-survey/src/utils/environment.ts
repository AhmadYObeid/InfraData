// src/utils/environment.ts
// Helper functions to detect the current environment (Vite)
export const isProduction = (): boolean => import.meta.env.PROD;
export const isDevelopment = (): boolean => import.meta.env.DEV;
export const getRedirectUri = (): string => {
  // Use configured VITE_AUTH_REDIRECT_URI if provided, else current origin
  return import.meta.env.VITE_AUTH_REDIRECT_URI || window.location.origin;
};
