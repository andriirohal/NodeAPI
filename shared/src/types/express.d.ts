import type { UserPayload } from "./shared.types.ts";

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    };
  };
};

export type {
  UserPayload
};