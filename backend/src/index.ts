import express, { Request, Response } from "express";
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Bu Kelime savaşları backendidir.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
