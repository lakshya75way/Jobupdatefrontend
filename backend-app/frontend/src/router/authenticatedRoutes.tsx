import { RouteObject } from "react-router-dom";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

const authenticatedRouter: RouteObject = {
  path: "dashboard",
  element: <AuthenticatedLayout />,
  children: [
    {
      index: true,
      lazy: () =>
        import("../pages/Dashboard/DashboardOverviewPage").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "jobs",
      lazy: () =>
        import("../pages/JobMonitor/JobMonitorPage").then((m) => ({
          Component: m.default,
        })),
    },
    {
      path: "profile",
      lazy: () =>
        import("../pages/UserProfilePage").then((m) => ({
          Component: m.default,
        })),
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

export default authenticatedRouter;
