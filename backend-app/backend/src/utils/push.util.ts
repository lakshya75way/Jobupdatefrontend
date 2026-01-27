import webpush from "web-push";
import { User } from "../models/user.model";
import { env } from "../config/env";
import { PushNotificationPayload } from "../types/push.types";

const VAPID_PUBLIC_KEY = env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  `mailto:${env.MAIL_USER}`,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

export const sendPushNotification = async (
  userId: string,
  payload: PushNotificationPayload,
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
    return;
  }

  const notificationPayload = JSON.stringify(payload);
  const activeSubscriptions = user.pushSubscriptions.filter(
    (sub) => sub.isActive !== false,
  );

  const sendPromises = activeSubscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, notificationPayload, {
        TTL: 24 * 60 * 60,
        urgency: "high",
      });
      const subIndex = user.pushSubscriptions?.findIndex(
        (s) => s.endpoint === subscription.endpoint,
      );
      if (subIndex !== undefined && subIndex >= 0) {
        await User.findByIdAndUpdate(userId, {
          $set: {
            [`pushSubscriptions.${subIndex}.lastUsedAt`]: new Date(),
          },
        });
      }
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 410 || statusCode === 404) {
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              "pushSubscriptions.$[elem].isActive": false,
            },
          },
          {
            arrayFilters: [{ "elem.endpoint": subscription.endpoint }],
          },
        );
      }
    }
  });

  await Promise.all(sendPromises);
};
