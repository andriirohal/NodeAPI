import { afterEach, test, expect } from "@jest/globals";

import { signUpUser } from "../../auth/src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

import type { UserPayload } from "../src/types/express.js";
import { verifyRefreshString, signRefreshString } from "../src/jwt/shared.jwt.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com"
    }
  });
});

test("verifies a refresh token", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const payload = {
    userId: user.data.userId,
    name: user.data.name,
    email: user.data.email,
    role: user.data.role
  } as UserPayload;

  const refreshToken = signRefreshString(payload);
  const response = verifyRefreshString(refreshToken);

  expect(response).toEqual(
    expect.objectContaining(payload)
  );
});

test("rejects an invalid user payload", async () => {
  const payload = {} as UserPayload;

  const refreshToken = signRefreshString(payload);
  const response = verifyRefreshString(refreshToken);

  expect(response).toBeNull();
});

test("returns null when an error occurs", () => {
  const response = verifyRefreshString("");

  expect(response).toBeNull();
});