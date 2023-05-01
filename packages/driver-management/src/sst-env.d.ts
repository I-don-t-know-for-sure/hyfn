/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly GENERATE_SOURCEMAP: string
  readonly VITE_APP_BUCKET_URL: string
  readonly VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL: string
  readonly VITE_APP_PAYMENT_APP_URL: string
  readonly VITE_APP_COGNITO_IDENTITY_POOL_ID: string
  readonly VITE_APP_COGNITO_REGION: string
  readonly VITE_APP_FIREBASE_API_KEY: string
  readonly VITE_APP_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_APP_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_APP_FIREBASE_PROJECT_ID: string
  readonly VITE_APP_FIREBASE_APP_ID: string
  readonly VITE_APP_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_APP_VAPID_KEY: string
  readonly VITE_APP_USER_POOL_ID: string
  readonly VITE_APP_USER_POOL_CLIENT_ID: string
  readonly VITE_APP_BUCKET: string
  readonly VITE_APP_BASE_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}