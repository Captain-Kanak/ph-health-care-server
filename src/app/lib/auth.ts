import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "@prisma/client";
import { env } from "../../config/env";
import ms, { StringValue } from "ms";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [`${env.APP_URL}`],
  session: {
    expiresIn: ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
    updateAge: ms(env.BETTER_AUTH_SESSION_UPDATE_AGE as StringValue) / 1000,
    cookieCache: {
      enabled: true,
      maxAge: ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
    },
  },
  advanced: {
    disableCSRFCheck: true,
  },
  cookies: {
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({ where: { email } });

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email address",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
              attachments: [
                {
                  filename: "logo.png",
                  content: "logo",
                  contentType: "image/png",
                },
              ],
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            sendEmail({
              to: email,
              subject: "Reset your password",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
              attachments: [
                {
                  filename: "logo.png",
                  content: "logo",
                  contentType: "image/png",
                },
              ],
            });
          }
        }
      },
      expiresIn: 60 * 2,
      otpLength: 6,
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
});
