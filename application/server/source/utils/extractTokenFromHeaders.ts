import { status } from "elysia";

export const extractToken = async (authorization: string | undefined) => {
  if (!authorization?.startsWith("Bearer ")) throw status(401, "Unauthorized");

  return authorization.slice(7);
};
