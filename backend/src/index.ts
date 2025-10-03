import express, { Request, Response } from "express";
import { useSocketAuthMiddleware } from "./middlewares/socketAuthMiddleware";
import { getExpressAuth } from "./lib/authjs";
const http = require("http");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { runSocketLogic } = require("./socketLogic");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
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
  mode: process.env.ENV,
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

// listen for requests
server.listen(port, () => {
  console.log("connected to db & listening on port", port);
});
