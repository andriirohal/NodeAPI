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
  jest.restoreAllMocks();

  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com" 
    }
  });
});

test("rotates user tokens", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: user.data.userId,
    name: user.data.name,
    email: user.data.email,
    role: user.data.role
  });

  jest.mocked(issueAuthentication).mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: "xY7kLm2NpQ8vRs4TuW1aBc9DeF3gHi6J.Kl5Mn8PqR2sTuV4wXy7ZaB9CdE1fGh3JkL5mN8pQ.signature"
  });

  const response = await rotateUserTokens(user.data.refreshToken);

  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
});

test("rejects an invalid refresh token", async () => {
  const response = await rotateUserTokens("");

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const response = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
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

  const response = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(response.success).toBe(false);
  expect(response.status).toBe(404);
});

test("rejects an invalid refresh token second", async () => {  
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: user.data.userId,
    name: user.data.name,
    email: user.data.email,
    role: user.data.role
  });

  await client.users.update({
    data: {
      refresh_token: null
    },
    where: {
      id: user.data.userId
    }
  });

  const response = await rotateUserTokens("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature");

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});

test("rejects an invalid refresh token", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  jest.mocked(parseRefreshToken).mockReturnValue({
    userId: user.data.userId,
    name: user.data.name,
    email: user.data.email,
    role: user.data.role
  });

  jest.mocked(issueAuthentication).mockReturnValue({
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImlhdCI6MTc2MTYwMDAwMH0.signature",
    refreshToken: ""
  });

  const response = await rotateUserTokens(user.data.refreshToken);

  expect(response.success).toBe(false);
  expect(response.status).toBe(401);
});