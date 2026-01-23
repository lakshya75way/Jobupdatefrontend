import React from "react";
import { App as AntdApp } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useRestoreSession } from "./hooks/useRestoreSession";
import { notificationService } from "./services/notification.service";
import "./variables.css";

const GlobalStaticApp: React.FC = () => {
  const { notification, message, modal } = AntdApp.useApp();

  React.useEffect(() => {
    // Attach to our singleton service to avoid "static function can not consume context" warnings
    notificationService.setAntdInstances({
      notification,
      message,
      modal,
    });
  }, [notification, message, modal]);

  return null;
};

const App: React.FC = () => {
  useRestoreSession();
  return (
    <>
      <GlobalStaticApp />
      <RouterProvider router={router} />
    </>
  );
};
export default App;
