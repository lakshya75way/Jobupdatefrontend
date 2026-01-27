import React from "react";
import { App as AntdApp } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";
import { useRestoreSession } from "./hooks/useRestoreSession";
import { notificationService } from "./services/notificationService";
import { ErrorBoundary } from "./components";
import "./variables.css";

const GlobalStaticApp: React.FC = () => {
  const { notification, message, modal } = AntdApp.useApp();

  React.useEffect(() => {
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
    <ErrorBoundary>
      <GlobalStaticApp />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
export default App;
