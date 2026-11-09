import jwt from "jsonwebtoken";

import { isUserPayload } from "../helpers/shared.helper.js";
import type { UserPayload } from "../types/shared.types.js";

export function getEnvironmentKey(key: string): string {
  const secret = process.env[key];

  if (!secret) {
    return "";
  };

  return secret;
};

const ACCESS_SECRET = getEnvironmentKey("ACCESS_SECRET");

export function signAccessToken(payload: UserPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m"
  });
};

export function verifyAccessToken(accessToken: string): UserPayload | null {
  try {
    const payload = jwt.verify(accessToken, ACCESS_SECRET, {
      algorithms: ["HS256"]
    });

    if (!isUserPayload(payload)) {
      return null;
    };

    return payload as UserPayload;

  } catch {
    return null;
  };
};

const REFRESH_SECRET = getEnvironmentKey("REFRESH_SECRET");

export function verifyRefreshToken(refreshToken: string): UserPayload | null {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET, {
      algorithms: ["HS256"]
    });

    if (!isUserPayload(payload)) {
      return null;
    };

    return payload as UserPayload;

  } catch {
    return null;
  };
};

export function signRefreshToken(payload: UserPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "14d"
  });
};