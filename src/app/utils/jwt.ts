import { UserRole, UserStatus } from "@prisma/client";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { DecodedUser } from "../../types/auth.type";

const createToken = (
  payload: JwtPayload,
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
