import nodemailer from "nodemailer";
import { config } from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  if (!config.email.host || !config.email.user) {
    console.warn(
      "[Email] ⚠️  SMTP configuration missing. Email will NOT be sent."
    );
    console.warn(
      "[Email] ℹ️  Check your backend terminal for verification links."
    );
    return;
  }

  const mailOptions = {
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("[Email Error]:", error);
  }
};

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
) => {
  const url = `${config.frontendUrl}/verify-email?token=${token}`;
  await sendEmail({
    to,
    subject: "Verify your email - TaskFlow",
    text: `Hi ${name},\n\nPlease verify your email by clicking the link: ${url}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Welcome to TaskFlow!</h2>
        <p>Hi ${name},</p>
        <p>Thanks for joining TaskFlow. Please click the button below to verify your email address:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${url}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  token: string
) => {
  const url = `${config.frontendUrl}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: "Reset your password - TaskFlow",
    text: `Hi ${name},\n\nYou requested a password reset. Please use the following link: ${url}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>This link is valid for 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">TaskFlow Security</p>
      </div>
    `,
  });
};

export const sendBoardInvitation = async (
  to: string,
  inviterName: string,
  boardName: string,
  boardId: string
) => {
  const url = `${config.frontendUrl}/boards/${boardId}/accept`;
  await sendEmail({
    to,
    subject: `You've been invited to collab on "${boardName}"`,
    text: `Hi,\n\n${inviterName} has invited you to collaborate on the board "${boardName}". Join here: ${url}`,
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Collaboration Invitation</h2>
          <p>${inviterName} has invited you to collaborate on the board <strong>"${boardName}"</strong>.</p>
          <p>Click the button below to view and join the board:</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Accept Invitation</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">TaskFlow Team</p>
        </div>
      `,
  });
};
