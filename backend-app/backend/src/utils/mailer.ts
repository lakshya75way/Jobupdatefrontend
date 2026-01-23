import nodemailer from "nodemailer";
import { env } from "../config/env";
export const mailer = nodemailer.createTransport({
  host: env.mailHost,
  port: env.mailPort,
  secure: false,
  auth: {
    user: env.mailUser,
    pass: env.mailPass,
  },
});
export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  await mailer.sendMail({
    from: `"TEST APP" <${env.mailUser}>`,
    to,
    subject,
    text,
    html,
  });
};
