import dotenv from "dotenv";
dotenv.config();
export const env = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  mailHost: process.env.MAIL_HOST as string,
  mailPort: Number(process.env.MAIL_PORT),
  mailUser: process.env.MAIL_USER as string,
  mailPass: process.env.MAIL_PASSWORD as string,
  mongoUrl: process.env.MONGO_URI as string,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY as string,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY as string,
};
