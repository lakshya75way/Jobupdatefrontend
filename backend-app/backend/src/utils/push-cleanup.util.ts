import { User } from "../models/user.model";

/**
 * Cleanup inactive push subscriptions older than specified days
 * This should be run periodically (e.g., daily cron job)
 */
export const cleanupInactiveSubscriptions = async (
  daysInactive: number = 30,
): Promise<void> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  await User.updateMany(
    {},
    {
      $pull: {
        pushSubscriptions: {
          $or: [
            { isActive: false, lastUsedAt: { $lt: cutoffDate } },
            { isActive: false, lastUsedAt: { $exists: false } },
          ],
        },
      },
    },
  );
};

/**
 * Get push subscription statistics for monitoring
 */
export const getPushSubscriptionStats = async (): Promise<{
  totalUsers: number;
  usersWithPush: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
}> => {
  const users = await User.find({
    pushSubscriptions: { $exists: true, $ne: [] },
  });

  const stats = users.reduce(
    (acc, user) => {
      const subs = user.pushSubscriptions || [];
      acc.totalSubscriptions += subs.length;
      acc.activeSubscriptions += subs.filter(
        (s) => s.isActive !== false,
      ).length;
      acc.inactiveSubscriptions += subs.filter(
        (s) => s.isActive === false,
      ).length;
      return acc;
    },
    {
      totalUsers: 0,
      usersWithPush: users.length,
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      inactiveSubscriptions: 0,
    },
  );

  const totalUsers = await User.countDocuments();
  stats.totalUsers = totalUsers;

  return stats;
};
