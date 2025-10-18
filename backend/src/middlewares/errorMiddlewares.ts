import { ErrorRequestHandler, RequestHandler } from "express";
import { t } from "../lib/i18n";

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  const locale = req.cookies.locale;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = t(locale, "notFound");
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.ENV === "production" ? null : err.stack,
  });
};
