import nodemailer from "nodemailer";
import { env } from "../../config/env";
import AppError from "../errors/AppError";
import status from "http-status";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SENDER_SMTP_HOST,
  port: Number(env.EMAIL_SENDER_SMTP_PORT),
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: env.EMAIL_SENDER_SMTP_USER,
    pass: env.EMAIL_SENDER_SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: env.EMAIL_SENDER_SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`email send to ${to} : ${info.messageId}`);
  } catch (error: any) {
    console.log("Email Sending Error:", error);

    throw new AppError(
      error.message || "Failed to send email",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};
