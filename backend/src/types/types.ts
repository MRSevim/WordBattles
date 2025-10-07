//Types for overall app data

import { User } from "better-auth/*";
import { Request } from "express";

export interface ExtendedRequest extends Request {
  user?: User;
}
