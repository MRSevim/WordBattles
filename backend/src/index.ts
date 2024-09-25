import express, { Request, Response } from "express";
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Bu Kelime savaşları backendidir.");
});

io.on("connection", (socket: any) => {
  console.log("a user connected");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
