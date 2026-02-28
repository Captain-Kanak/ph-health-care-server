import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "@prisma/client";
import { env } from "../../config/env";
import ms, { StringValue } from "ms";

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
    secure: false,
    sameSite: "lax",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
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
