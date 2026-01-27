import { useState, useEffect } from "react";

export const useNotificationPermission = () => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        setShouldShow(Notification.permission === "default");
      }
    };

    const timer = setTimeout(checkPermission, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        checkPermission();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return shouldShow;
};
