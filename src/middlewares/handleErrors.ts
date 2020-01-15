import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import {
  CredentialsExpiredError,
  InvalidCredentialsError
} from "../endpoints/user/errors";
import { ServerError } from "../utils/errors";
import logger from "../utils/logger";

function handleErrors(err: Error | any, req: Request, res: Response) {
  if (err.name === JsonWebTokenError.name) {
    res.status(200).send({
      errors: [new InvalidCredentialsError()]
    });
  } else if (err.name === TokenExpiredError.name) {
    res.status(200).send({
      errors: [new CredentialsExpiredError()]
    });
  } else {
    res.status(500).send({
      errors: [new ServerError()]
    });
  }

  logger.error(err);
}

export default handleErrors;
