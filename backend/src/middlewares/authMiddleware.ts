import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { RequestHandler } from "express";
import { ExtendedRequest, User } from "../types/types";

export const protect: RequestHandler = async (
  req: ExtendedRequest,
  res,
  next
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    const user = session?.user as User | undefined;

    if (!user) throw new Error("Not authorized, Sign in please");

    // ✅ Attach the user to req if you need it later
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
