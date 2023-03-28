/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}