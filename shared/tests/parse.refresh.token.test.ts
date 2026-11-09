import { test, expect } from "@jest/globals";

import type { UserPayload } from "../src/types/express.js";

import { parseRefreshToken } from "../src/helpers/shared.helper.js";
import { signRefreshToken } from "../src/jwt/shared.jwt.js";

test("parses a refresh token", () => {
  const payload = {
    userId: "7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d",
    name: "Sarah",
    email: "sarah.test@example.com",
    role: "user"
  } as UserPayload;

  const refreshToken = signRefreshToken(payload);

  expect(parseRefreshToken(refreshToken)).toEqual(
    expect.objectContaining(payload)
  );
});

test("rejects an empty refresh token", () => {
  expect(parseRefreshToken("")).toBeNull();
});