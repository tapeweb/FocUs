import { status } from "elysia";

export const ExtractToken = async (Authorization: string | undefined) => {
  if (!Authorization?.startsWith("Bearer ")) throw status(401, "Unauthorized");

  return Authorization.slice(7);
};
