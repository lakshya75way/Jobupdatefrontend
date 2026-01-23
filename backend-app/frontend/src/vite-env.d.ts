declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.css" {
  const content: string;
  export default content;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_VAPID_PUBLIC_KEY: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}
