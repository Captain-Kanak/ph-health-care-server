import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "@prisma/client";
import { env } from "../../config/env";
import ms, { StringValue } from "ms";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [`${env.FRONTEND_URL}`],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: Math.floor(
      ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
    ),
    updateAge: Math.floor(
      ms(env.BETTER_AUTH_SESSION_UPDATE_AGE as StringValue) / 1000,
    ),
    cookieCache: {
      enabled: true,
      maxAge: Math.floor(
        ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue) / 1000,
      ),
    },
  },
  // redirectURLs: {
  //   signIn: ``,
  // },
  advanced: {
    disableCSRFCheck: true,
    cookiePrefix: "better-auth",
    useSecureCookies: env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    cookies: {
      state: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,

      mapProfileToUser: () => {
        return {
          role: UserRole.PATIENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
        };
      },
    },
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
