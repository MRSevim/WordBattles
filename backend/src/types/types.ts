//Types for overall app data
import { User } from "@prisma/client";
import { Request } from "express";
import { Server, Socket, ExtendedError } from "socket.io";

export { User };

//express types
export interface ExtendedRequest extends Request {
  user?: User;
}

//socket types
export type Io = Server;
export { Socket };
export type SocketNext = (err?: ExtendedError) => void;

declare module "socket.io" {
  interface Socket {
    user?: User;
    roomId?: string;
    sessionId: string;
    siteLocale: Lang;
  }
}

export type Lang = "tr" | "en";
