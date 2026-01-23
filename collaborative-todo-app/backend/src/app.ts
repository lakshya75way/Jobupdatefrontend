import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/env.config.js";
import appRoutes from "./routes/app.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRoutes);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server! Did you mean /api${req.originalUrl}?`,
  });
});

app.use(globalErrorHandler);

export default app;
