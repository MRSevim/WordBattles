import express, { Request, Response } from "express";
const http = require("http");
const dotenv = require("dotenv");
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
    origin: [process.env.FRONTEND_URL, "https://admin.socket.io"],
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Bu Kelime savaşları backendidir.");
});

runSocketLogic(io);

instrument(io, {
  auth: false,
  mode: process.env.ENV,
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
