/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Service Worker 타입
interface Window {
  workbox: any;
}

// Build time 타입
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
