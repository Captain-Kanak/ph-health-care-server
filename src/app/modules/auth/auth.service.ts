import AppError from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { Patient, User, UserRole, UserStatus } from "@prisma/client";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { LoginUserPayload, RegisterPatientPayload } from "./auth.interface";

const registerPatient = async (
  payload: RegisterPatientPayload,
): Promise<{
  accessToken: string;
  refreshToken: string;
  token: string | null;
  user: User;
  patient: Patient;
}> => {
  try {
    const { name, email, password, gender } = payload;

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

    const patient = await prisma.patient.create({
      data: {
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        gender,
      },
    });

    if (!patient) {
      await prisma.user.delete({ where: { id: data.user.id } });

      throw new AppError(
        "Failed to create patient",
        status.INTERNAL_SERVER_ERROR,
      );
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
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        image: data.user.image as string | null,
        role: data.user.role as UserRole,
        status: data.user.status as UserStatus,
        needPasswordChange: data.user.needPasswordChange,
        isDeleted: data.user.isDeleted,
        deletedAt: data.user.deletedAt as Date | null,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
      },
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

const loginUser = async (
  payload: LoginUserPayload,
): Promise<{
  accessToken: string;
  refreshToken: string;
  token: string;
  redirect: boolean;
  url?: string | undefined;
  user: User;
}> => {
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
      token: data.token,
      redirect: data.redirect,
      url: data.url,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        image: data.user.image as string | null,
        role: data.user.role as UserRole,
        status: data.user.status as UserStatus,
        needPasswordChange: data.user.needPasswordChange,
        isDeleted: data.user.isDeleted,
        deletedAt: data.user.deletedAt as Date | null,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
      },
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
