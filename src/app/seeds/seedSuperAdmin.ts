import status from "http-status";
import AppError from "../errors/AppError";
import { Gender, UserRole } from "@prisma/client";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const seedSuperAdmin = async () => {
  try {
    const userData = {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "password123",
      role: UserRole.SUPER_ADMIN,
    };

    const createdUser = await auth.api.signUpEmail({
      body: userData,
    });

    if (!createdUser) {
      throw new AppError(
        "Failed to seed Super Admin",
        status.INTERNAL_SERVER_ERROR,
      );
    }

    const user = createdUser.user;

    console.log("Super Admin created successfully", { user });

    const adminData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      gender: Gender.MALE,
    };

    const createdAdmin = await prisma.admin.create({
      data: adminData,
    });

    if (!createdAdmin) {
      throw new AppError(
        "Failed to seed Super Admin",
        status.INTERNAL_SERVER_ERROR,
      );
    }

    console.log("Super Admin seeded successfully", { createdAdmin });
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to seed Super Admin",
      status.INTERNAL_SERVER_ERROR,
    );
  }
};

seedSuperAdmin();
