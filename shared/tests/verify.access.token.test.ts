import { afterEach, test, expect } from "@jest/globals";

import { signUpUser } from "../../auth/src/services/auth.service.js";
import { client } from "../../auth/src/prisma/client.js";

import { signAccessToken, verifyAccessToken } from "../src/jwt/shared.jwt.js";
import type { UserPayload } from "../src/types/express.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com"
    }
  });
});

test("verifies an access token", async () => {
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

  const accessToken = signAccessToken(payload);

  expect(verifyAccessToken(accessToken)).toEqual(
    expect.objectContaining(payload)
  );
});

test("rejects an invalid user payload", () => {
  const payload = {} as UserPayload;
  const accessToken = signAccessToken(payload);

  expect(verifyAccessToken(accessToken)).toBeNull();
});

test("returns null when an error occurs", async () => {
  expect(verifyAccessToken("")).toBeNull();
});