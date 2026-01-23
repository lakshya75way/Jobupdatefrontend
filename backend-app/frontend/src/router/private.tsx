import { RouteObject } from "react-router-dom";
import Authenticated from "../layouts/Authenticated";

const privateRouter: RouteObject = {
  path: "dashboard",
  element: <Authenticated />,
  children: [
    {
      index: true,
      lazy: () =>
        import("../pages/homepage").then((m) => ({ Component: m.default })),
    },
    {
      path: "jobs",
      lazy: () =>
        import("../pages/jobs").then((m) => ({ Component: m.default })),
    },
    {
      path: "profile",
      lazy: () =>
        import("../pages/profile").then((m) => ({ Component: m.default })),
    },
    {
      path: "uploads",
      lazy: () =>
        import("../pages/Uploads/UploadsPage").then((m) => ({
          Component: m.default,
        })),
    },
  ],
};

export default privateRouter;
