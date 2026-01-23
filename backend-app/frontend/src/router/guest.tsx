import { RouteObject } from "react-router-dom";
import Guest from "../layouts/Guest";

const guestRouter: RouteObject = {
  element: <Guest />,
  children: [
    {
      path: "login",
      lazy: () =>
        import("../pages/login").then((m) => ({ Component: m.default })),
    },
    {
      path: "signup",
      lazy: () =>
        import("../pages/register").then((m) => ({ Component: m.default })),
    },
    {
      path: "forgot-password",
      lazy: () =>
        import("../pages/forgot-password").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "reset/:token",
      lazy: () =>
        import("../pages/reset-password").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "verify/:token",
      lazy: () =>
        import("../pages/verify").then((m) => ({
          Component: m.default,
        })),
    },
  ],
};

export default guestRouter;
