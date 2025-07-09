interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly VITE_REDIRECT_URI?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const isProduction = () => {
  return import.meta.env.PROD === true;
};

export const isDevelopment = () => {
  return import.meta.env.DEV === true;
};

export const getRedirectUri = (): string => {
  // Use VITE_REDIRECT_URI if set, otherwise default to current origin
  return import.meta.env.VITE_REDIRECT_URI || window.location.origin;
};
