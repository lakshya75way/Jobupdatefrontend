import nodemailer from "nodemailer";
import { env } from "../config/env";

export const mailer = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
) => {
  await mailer.sendMail({
    from: `"TEST APP" <${env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
