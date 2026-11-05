import { afterEach, test, expect } from "@jest/globals";

import { getLoggedInUser, signUpUser } from "../src/services/auth.service.js";
import { client } from "../src/prisma/client.js";

afterEach(async () => {
  await client.users.deleteMany({
    where: {
      email: "sarah.test@example.com"
    }
  });
});

test("gets the logged in user", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await getLoggedInUser(user.data.userId);

  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
});

test("rejects missing user", async () => {
  const user = await signUpUser({
    name: "Sarah",
    email: "sarah.test@example.com",
    password: "sarah12345"
  });

  if (!user.success) {
    throw new Error("Expected a user");
  };

  const response = await getLoggedInUser("7f3a9c2e-6b41-4d85-9a72-e1c6b0f4583d");

  expect(response.success).toBe(false);
  expect(response.status).toBe(404);
});