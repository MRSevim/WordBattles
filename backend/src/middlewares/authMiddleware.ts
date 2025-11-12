import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { RequestHandler } from "express";
import { ExtendedRequest, User } from "../types/types";
import { t } from "../lib/i18n";

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

    const locale = req.cookies.locale;

    if (!user) throw new Error(t(locale, "notAuthorized"));

    // ✅ Attach the user to req if you need it later
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
