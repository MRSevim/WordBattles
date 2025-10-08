import express, { Request, Response } from "express";
import { useSocketAuthMiddleware } from "./middlewares/socketAuthMiddleware";
import { auth } from "./lib/auth";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { runSocketLogic } from "./socketLogic";
import ladderRoutes from "./routes/ladderRoutes";
import { notFound, errorHandler } from "./middlewares/errorMiddlewares";
import { prisma } from "./lib/prisma";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!],
  },
  connectionStateRecovery: {},
});

const port = process.env.PORT || 3000;

// Configure CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

//logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//better-auth catchall route needs to be before express.json() middleware
app.all("/api/auth/*splat", toNodeHandler(auth));

// middlewares
app.use(express.json());
app.use(cookieParser());

useSocketAuthMiddleware(io);

app.use("/api/ladder", ladderRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("This is WordBattles backend.");
});

runSocketLogic(io);

instrument(io, {
  auth: false,
  mode: process.env.ENV as "development" | "production",
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

// listen for requests
prisma
  .$connect()
  .then(() => {
    server.listen(port, () => {
      console.log("connected to db & listening on port", port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
