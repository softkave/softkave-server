import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import multer from "multer";
import {
  CredentialsExpiredError,
  InvalidCredentialsError,
} from "../endpoints/user/errors";
import { ServerError } from "../utilities/errors";
import logger from "../utilities/logger";

export function resolveJWTError(err: Error) {
  if (err.name === JsonWebTokenError.name || err.name === "UnauthorizedError") {
    return new InvalidCredentialsError();
  } else if (err.name === TokenExpiredError.name) {
    return new CredentialsExpiredError();
  }
}

function handleErrors(err: Error | any, req: Request, res: Response, next) {
  const JWTError = resolveJWTError(err);

  if (JWTError) {
    res.status(401).send({
      errors: [JWTError],
    });
  } else if (err instanceof multer.MulterError) {
    // TODO: how can we handle this better?
    res.status(500).send(err);
  } else {
    res.status(500).send({
      errors: [new ServerError()],
    });
  }

  logger.error(err);
}

export default handleErrors;
