import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "@prisma/client";
import { env } from "../../config/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [`${env.APP_URL}`],
  session: {
    expiresIn: Number(env.ACCESS_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
    updateAge: Number(env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE) * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: Number(env.ACCESS_TOKEN_EXPIRES_IN) * 24 * 60 * 60,
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
    autoSignIn: false,
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
