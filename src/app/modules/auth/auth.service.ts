import { AppError } from "../../utils/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "@prisma/client";

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginUserPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: RegisterPatientPayload) => {
  try {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!data.user) {
      throw new AppError("Failed to register patient", 400);
    }

    // TODO: Create patient profile
    // const patient = await prisma.$transaction(async (trx) => {});

    return data;
  } catch (error) {
    console.error(error);

    throw new AppError("Failed to register patient", 500);
  }
};

const loginUser = async (payload: LoginUserPayload) => {
  try {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new AppError("User is blocked", 400);
    }

    if (user.status === UserStatus.DELETED || user.isDeleted) {
      throw new AppError("User is deleted", 400);
    }

    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!data.user) {
      throw new AppError("Failed to login user", 400);
    }

    return data;
  } catch (error) {
    console.error(error);

    throw new AppError("Failed to login user", 500);
  }
};

export const AuthService = {
  registerPatient,
  loginUser,
};
