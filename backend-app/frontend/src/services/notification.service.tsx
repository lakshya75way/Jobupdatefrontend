import { notification, message } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import api from "./api";
import {
  AntdStaticInstances,
  NotificationOptions,
  NotificationType,
} from "../types/notification.types";

class NotificationService {
  private static instance: NotificationService;
  private static antdInstances: Partial<AntdStaticInstances> = {};
  private swRegistration: ServiceWorkerRegistration | null = null;

  public get message() {
    return NotificationService.antdInstances.message || message;
  }

  private constructor() {
    this.initServiceWorker();
  }

  public setAntdInstances(instances: AntdStaticInstances): void {
    NotificationService.antdInstances = instances;
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initServiceWorker() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const swUrl = import.meta.env.DEV ? "/dev-sw.js?dev-sw" : "/sw.js";
        const registration = await navigator.serviceWorker.register(swUrl, {
          type: import.meta.env.DEV ? "module" : "classic",
          scope: "/",
        });
        this.swRegistration = registration;
      } catch (err) {
        // Silent fail - SW registration is optional
      }
    }
  }

  /**
   * Helper to convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Subscribe user to Background Push Notifications
   */
  public async subscribeToPush(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        throw new Error("Missing VITE_VAPID_PUBLIC_KEY");
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey),
      });

      // Save to backend
      await api.post("/auth/push-subscription", subscription);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Unsubscribe from Push
   */
  public async unsubscribeFromPush(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await api.delete("/auth/push-subscription", {
          data: { endpoint: subscription.endpoint },
        });
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get current Push status
   */
  public async getPushStatus(): Promise<boolean> {
    if (!this.swRegistration) return false;
    const subscription =
      await this.swRegistration.pushManager.getSubscription();
    return !!subscription;
  }

  /**
   * Get current permission status
   */
  public getPermissionStatus(): NotificationPermission {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Request browser notification permission
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
    }
    return permission;
  }

  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;
  private pendingBatch: { success: string[]; error: string[] } = {
    success: [],
    error: [],
  };

  /**
   * Debounced notification for batching multiple file events
   */
  private debouncedNotify() {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      const { success, error } = this.pendingBatch;

      if (success.length > 0) {
        const title =
          success.length === 1 ? "Upload Complete" : "Uploads Complete";
        const message =
          success.length === 1
            ? `${success[0]} processed successfully.`
            : `${success.length} files processed successfully.`;

        this.executeNotify({ title, message, type: "success" });
      }

      if (error.length > 0) {
        const title = error.length === 1 ? "Upload Failed" : "Uploads Failed";
        const message =
          error.length === 1
            ? `Could not upload ${error[0]}.`
            : `${error.length} uploads failed to process.`;

        this.executeNotify({ title, message, type: "error" });
      }

      // Reset batch
      this.pendingBatch = { success: [], error: [] };
      this.notificationTimeout = null;
    }, 1000); // 1-second debounce window
  }

  /**
   * Show a hybrid notification (In-app + Browser)
   */
  private executeNotify(options: NotificationOptions) {
    const { title, message, type = "info", onClick, duration = 4.5 } = options;
    if (document.visibilityState === "visible") {
      this.showInAppNotification(title, message, type, onClick, duration);
      this.showBrowserNotification(title, message, onClick);
    }
  }

  public notify(options: NotificationOptions) {
    this.executeNotify(options);
  }

  private showInAppNotification(
    title: string,
    message: string,
    type: NotificationType,
    onClick?: () => void,
    duration?: number,
  ) {
    const icons = {
      success: <CheckCircleFilled style={{ color: "#10b981" }} />,
      error: <CloseCircleFilled style={{ color: "#ef4444" }} />,
      info: <InfoCircleFilled style={{ color: "#3b82f6" }} />,
      warning: <InfoCircleFilled style={{ color: "#f59e0b" }} />,
    };

    const config = {
      // @ts-ignore
      title: title,
      description: message,
      placement: "bottomRight" as const,
      duration,
      onClick,
      key: `upload-notif-${type}`,
      icon: icons[type],
    };

    if (NotificationService.antdInstances.notification) {
      NotificationService.antdInstances.notification[type](config);
    } else {
      notification[type]({
        ...config,
        style: {
          borderRadius: "12px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      });
    }
  }

  private showBrowserNotification(
    title: string,
    message: string,
    onClick?: () => void,
  ) {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      const iconUrl = `${window.location.origin}/vite.svg`;

      try {
        const options: globalThis.NotificationOptions = {
          body: message,
          icon: iconUrl,
          silent: false,
          tag: `upload-${Date.now()}`,
        };

        const n = new Notification(title, options);

        n.onclick = (e) => {
          e.preventDefault();
          window.focus();
          if (onClick) onClick();
          n.close();
        };
      } catch (err) {
        // Silent fail - notification is best-effort
      }
    }
  }

  /**
   * Trigger a test notification to verify OS-level alerts
   */
  public testNotification() {
    this.notify({
      title: "Test Notification 🔔",
      message: "Notification system is now debounced and spam-free!",
      type: "success",
    });
  }

  /**
   * Success notification helper
   */
  public success(
    title: string,
    message: string,
    onClick?: () => void,
    fileName?: string,
  ) {
    if (fileName) {
      this.pendingBatch.success.push(fileName);
      this.debouncedNotify();
    } else {
      this.notify({ title, message, type: "success", onClick });
    }
  }

  /**
   * Error notification helper
   */
  public error(
    title: string,
    message: string,
    onClick?: () => void,
    fileName?: string,
  ) {
    if (fileName) {
      this.pendingBatch.error.push(fileName);
      this.debouncedNotify();
    } else {
      this.notify({ title, message, type: "error", onClick });
    }
  }
}

export const notificationService = NotificationService.getInstance();
