/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_MSAL_CLIENTID: string;
  readonly VITE_MSAL_AUTHORITY_URL: string;
  readonly VITE_EMAIL_FUNCTION_URL: string;
  readonly VITE_AUTH_REDIRECT_URI?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
