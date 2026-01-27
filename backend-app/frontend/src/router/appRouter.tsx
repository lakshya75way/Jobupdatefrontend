import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import guestRouter from "./guestRoutes";
import authenticatedRouter from "./authenticatedRoutes";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  guestRouter,
  authenticatedRouter,
  {
    path: "register",
    element: <Navigate to="/signup" replace />,
  },
  {
    path: "*",
    lazy: () =>
      import("../pages/NotFoundPage").then((m) => ({ Component: m.default })),
  },
];

export const router = createBrowserRouter(routes);
