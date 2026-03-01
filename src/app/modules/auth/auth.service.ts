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
  user: any;
}> => {
  try {
    const { email, password } = payload;

    const isUserExists = await prisma.user.findUnique({ where: { email } });

    if (!isUserExists) {
      throw new AppError("User not found", status.NOT_FOUND);
    }

    if (isUserExists?.status === UserStatus.BLOCKED) {
      throw new AppError("User is blocked", status.FORBIDDEN);
    }

    if (
      isUserExists?.status === UserStatus.DELETED ||
      isUserExists?.isDeleted
    ) {
      throw new AppError("User is deleted", status.NOT_FOUND);
    }

    const userData = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!userData) {
      throw new AppError("Invalid email or password", status.UNAUTHORIZED);
    }

    const accessToken = tokenUtils.createAccessToken({
      id: userData.user.id,
      name: userData.user.name,
      email: userData.user.email,
      emailVerified: userData.user.emailVerified,
      role: userData.user.role,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
    });

    const refreshToken = tokenUtils.createRefreshToken({
      id: userData.user.id,
      name: userData.user.name,
      email: userData.user.email,
      emailVerified: userData.user.emailVerified,
      role: userData.user.role,
      status: userData.user.status,
      isDeleted: userData.user.isDeleted,
    });

    const user = await prisma.user.findUnique({
      where: { id: userData.user.id },
      include: {
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    return {
      accessToken,
      refreshToken,
      token: userData.token,
      redirect: userData.redirect,
      url: userData.url,
      user,
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
