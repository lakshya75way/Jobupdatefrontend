import { RouteObject } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";

const guestRouter: RouteObject = {
  element: <GuestLayout />,
  children: [
    {
      path: "login",
      lazy: () =>
        import("../pages/LoginPage").then((m) => ({ Component: m.default })),
    },
    {
      path: "signup",
      lazy: () =>
        import("../pages/RegisterPage").then((m) => ({ Component: m.default })),
    },
    {
      path: "forgot-password",
      lazy: () =>
        import("../pages/ForgotPasswordPage").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "reset/:token",
      lazy: () =>
        import("../pages/ResetPasswordPage").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "verify/:token",
      lazy: () =>
        import("../pages/EmailVerificationPage").then((m) => ({
          Component: m.default,
        })),
    },
  ],
};

export default guestRouter;
