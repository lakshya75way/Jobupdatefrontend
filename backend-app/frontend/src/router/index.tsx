import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import guestRouter from "./guest";
import privateRouter from "./private";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  guestRouter,
  privateRouter,
  {
    path: "register",
    element: <Navigate to="/signup" replace />,
  },
  {
    path: "*",
    lazy: () =>
      import("../pages/not-found").then((m) => ({ Component: m.default })),
  },
];

export const router = createBrowserRouter(routes);
