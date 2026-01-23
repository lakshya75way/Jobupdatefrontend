import { NotificationInstance } from "antd/es/notification/interface";
import { MessageInstance } from "antd/es/message/interface";
import { ModalStaticFunctions } from "antd/es/modal/confirm";

export interface AntdStaticInstances {
  notification: NotificationInstance;
  message: MessageInstance;
  modal: Omit<ModalStaticFunctions, "warn">;
}

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: PushSubscriptionKeys;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  onClick?: () => void;
  duration?: number;
}
