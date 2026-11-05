import { test, expect } from "@jest/globals";

import { getSecret } from "../src/config.js";

test("rejects an invalid secret key", () => {
  expect(getSecret("MISSING_SECRET")).toBeNull();
});