import { parse } from "cookie";
import { Request, Response, NextFunction } from "express";

export function parseCookies(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.cookie || "";
  req.cookies = parse(header); // same structure as cookie-parser
  next();
}
