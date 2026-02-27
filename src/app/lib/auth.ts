import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "@prisma/client";
import { env } from "../../config/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [`${env.APP_URL}`],
  session: {
    expiresIn: 1 * 24 * 60 * 60,
    updateAge: 7 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 1 * 24 * 60 * 60,
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
