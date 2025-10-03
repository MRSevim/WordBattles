import express, { Request, Response } from "express";
import { useSocketAuthMiddleware } from "./middlewares/socketAuthMiddleware";
import { getExpressAuth } from "./lib/authjs";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { runSocketLogic } from "./socketLogic";
import userRoutes from "./routes/userRoutes";
import { notFound, errorHandler } from "./middlewares/errorMiddlewares";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL!],
  },
});

const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(cookieParser());

useSocketAuthMiddleware(io);

app.use("/api/user", userRoutes);
app.use("/auth/{*any}", getExpressAuth());

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
