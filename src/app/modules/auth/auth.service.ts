import AppError from "../../utils/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "@prisma/client";
import status from "http-status";
import {
  LoginUserPayload,
  RegisterPatientPayload,
} from "../../../types/auth.type";
import { tokenUtils } from "../../utils/token";

const registerPatient = async (payload: RegisterPatientPayload) => {
  try {
    const { name, email, password } = payload;

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
      throw new AppError("User already exists", status.CONFLICT);
    }

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    const patient = await prisma.$transaction(async (trx) => {
      const createPatient = await trx.patient.create({
        data: {
          userId: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },
      });

      return createPatient;
    });

    if (!patient) {
      await prisma.user.delete({ where: { id: data.user.id } });
    }

    const accessToken = tokenUtils.createAccessToken({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    const refreshToken = tokenUtils.createRefreshToken({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    return {
      accessToken,
      refreshToken,
      ...data,
      patient,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to register patient",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

const loginUser = async (payload: LoginUserPayload) => {
  try {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.status === UserStatus.BLOCKED) {
      throw new AppError("User is blocked", status.FORBIDDEN);
    }

    if (user?.status === UserStatus.DELETED || user?.isDeleted) {
      throw new AppError("User is deleted", status.NOT_FOUND);
    }

    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    const accessToken = tokenUtils.createAccessToken({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    const refreshToken = tokenUtils.createRefreshToken({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    return {
      accessToken,
      refreshToken,
      ...data,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Failed to login user",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

export const AuthService = {
  registerPatient,
  loginUser,
};
