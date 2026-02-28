import { UserRole, UserStatus } from "@prisma/client";
import jwt, { SignOptions } from "jsonwebtoken";

interface DecodedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}

const createToken = (
  payload: DecodedUser,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
};

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as DecodedUser;

  return decoded;
};

const decodeToken = (token: string) => {
  const decoded = jwt.decode(token) as DecodedUser;

  return decoded;
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
