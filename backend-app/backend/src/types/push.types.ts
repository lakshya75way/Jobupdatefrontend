export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: PushSubscriptionKeys;
  userAgent?: string;
  createdAt?: Date;
  lastUsedAt?: Date;
  isActive?: boolean;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
}
