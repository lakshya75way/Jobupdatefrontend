import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT as string, 10),
  mongoUri: process.env.MONGODB_URI as string,
  nodeEnv: process.env.NODE_ENV as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,

  email: {
    host: process.env.MAIL_HOST as string,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASSWORD as string,
    from: (process.env.MAIL_FROM || process.env.MAIL_USER) as string,
  },

  frontendUrl: process.env.FRONTEND_URL as string,
};
