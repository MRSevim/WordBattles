import { Request } from "express";

export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  image?: string;
  rankedScore: number;
}
export interface ExtendedRequest extends Request {
  user?: UserInterface;
}
