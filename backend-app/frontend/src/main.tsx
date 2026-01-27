import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { store } from "./store/appStore";
import App from "./App";
import "./variables.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#6366f1",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      >
        <AntdApp message={{ maxCount: 1 }}>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
