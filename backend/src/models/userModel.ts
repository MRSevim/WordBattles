const mongoose = require("mongoose");
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

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: {
    type: String,
  },
  rankedScore: {
    type: Number,
    default: 3000,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
