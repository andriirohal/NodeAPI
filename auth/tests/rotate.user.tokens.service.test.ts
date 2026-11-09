import { beforeEach, afterEach, test, expect, jest } from "@jest/globals";

jest.mock("../../shared/src/helpers/shared.helper.js", () => ({
  ...jest.requireActual<typeof import("../../shared/src/helpers/shared.helper.js")>("../../shared/src/helpers/shared.helper.js"),
  issueAuthentication: jest.fn(() => ({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
  })),
  parseRefreshToken: jest.fn()
}));

import { issueAuthentication, parseRefreshToken } from "../../shared/src/helpers/shared.helper.js";

import { rotateUserTokens, signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

beforeEach(async () => {
  jest.mocked(parseRefreshToken).mockReturnValue(null);
});

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com" 
    }
  });
});

test("rotates user tokens", async () => {
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: createdUser.data.userId,
    name: createdUser.data.name,
    email: createdUser.data.email,
    role: createdUser.data.role
  });

  jest.mocked(issueAuthentication).mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
  });

  const rotatedTokens = await rotateUserTokens(createdUser.data.refreshToken);

  expect(rotatedTokens.success).toBe(true);
  expect(rotatedTokens.status).toBe(200);
});

test("rejects an invalid refresh token", async () => {
  const rotatedTokens = await rotateUserTokens("");

  expect(rotatedTokens.success).toBe(false);
  expect(rotatedTokens.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const rotatedTokens = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(rotatedTokens.success).toBe(false);
  expect(rotatedTokens.status).toBe(401);
});

test("rejects missing user", async () => {
  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Sarah",
    email: "sarah.test@example.com",
    role: "user"
  });

  jest.mocked(issueAuthentication).mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
  });

  const rotatedTokens = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(rotatedTokens.success).toBe(false);
  expect(rotatedTokens.status).toBe(404);
});

test("rejects an invalid refresh token second", async () => {  
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: createdUser.data.userId,
    name: createdUser.data.name,
    email: createdUser.data.email,
    role: createdUser.data.role
  });

  await client.users.update({
    data: {
      refresh_token: null
    },
    where: {
      id: createdUser.data.userId
    }
  });

  const rotatedTokens = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(rotatedTokens.success).toBe(false);
  expect(rotatedTokens.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const createdUser = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!createdUser.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: createdUser.data.userId,
    name: createdUser.data.name,
    email: createdUser.data.email,
    role: createdUser.data.role
  });

  jest.mocked(issueAuthentication).mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: ""
  });

  const rotatedTokens = await rotateUserTokens(createdUser.data.refreshToken);

  expect(rotatedTokens.success).toBe(false);
  expect(rotatedTokens.status).toBe(401);
});