import jwt from "jsonwebtoken";

import { isUserPayload } from "../helpers/shared.helper.js";

import { getSecret } from "../config.js";
import type { UserPayload } from "../types/shared.types.js";

const ACCESS_SECRET = getSecret("ACCESS_SECRET")!;

export function signAccessString(payload: UserPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    algorithm: "HS256",
    expiresIn: "10m"
  });
};

export function verifyAccessString(accessString: string): UserPayload | null {
  try {
    const payload = jwt.verify(accessString, ACCESS_SECRET, {
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

const REFRESH_SECRET = getSecret("REFRESH_SECRET")!;

export function verifyRefreshString(refreshString: string): UserPayload | null {
  try {
    const payload = jwt.verify(refreshString, REFRESH_SECRET, {
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

export function signRefreshString(payload: UserPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: "14d"
  });
};