export interface Notification {
  message: string;
  title: string;
  autoClose?: boolean | number;
  loading?: boolean;
  id?: string;
}
