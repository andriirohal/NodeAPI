import { test, expect } from "@jest/globals";

import { setRefreshToken } from "../src/helpers/shared.helper.js";

test("sets a refresh token cookie", () => {
  expect(setRefreshToken()).toEqual(
    expect.objectContaining({
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: "lax" as const
    })
  );
});