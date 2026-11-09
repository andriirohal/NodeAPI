import { test, expect } from "@jest/globals";

import { clearRefreshToken } from "../src/helpers/shared.helper.js";

test("clears the refresh token cookie", () => {
  expect(clearRefreshToken()).toEqual(
    expect.objectContaining({
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 0,
      sameSite: "lax" as const
    })
  );
});