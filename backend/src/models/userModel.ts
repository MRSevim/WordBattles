const mongoose = require("mongoose");
import { Request } from "express";

export interface ExtendedRequest extends Request {
  user?: { username: string; email: string; image?: string };
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
