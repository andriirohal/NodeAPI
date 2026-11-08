import validator from "validator";
import crypto from "node:crypto";

import { CookieOptions } from "express";

import { signAccessString, signRefreshString, verifyRefreshString } from "../jwt/shared.jwt.js";

import type { UserPayload } from "../types/express.js";
import type { Authentication } from "../types/shared.types.js";

export function isUserPayload(payload: unknown): payload is UserPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  };

  const candidate = payload as Record<string, unknown>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.role === "string" 
  );
};

export function isValidName(name: unknown): name is string {
  if (typeof name !== "string") {
    return false;
  };

  return name === name.trim() && name.length > 0;
};

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") {
    return false;
  };

  return validator.isEmail(email);
};

export function isValidPassword(password: unknown): password is string {
  if (typeof password !== "string") {
    return false;
  };

  return password.length >= 8 && password.length <= 100;
};

export function issueAuthentication(payload: UserPayload): Authentication {
  const accessToken = signAccessString(payload);
  const refreshToken = signRefreshString(payload);

  return {
    accessToken,
    refreshToken
  };
};

export function hashRefreshToken(refreshToken: string): string {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

export function parseRefreshToken(refreshToken: string | null): UserPayload | null {
  if (!refreshToken) {
    return null;
  };

  return verifyRefreshString(refreshToken);
};

export function setRefreshToken(): CookieOptions {
  return {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 14 * 24 * 60 * 60 * 1000,
    sameSite: "lax" as const
  };
};

export function clearRefreshToken(): CookieOptions {
  return {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: -1,
    sameSite: "lax" as const
  };
};