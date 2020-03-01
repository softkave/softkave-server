import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import {
  CredentialsExpiredError,
  InvalidCredentialsError
} from "../endpoints/user/errors";
import { ServerError } from "../utilities/errors";
import logger from "../utilities/logger";

function handleErrors(err: Error | any, req: Request, res: Response, next) {
  if (err.name === JsonWebTokenError.name || err.name === "UnauthorizedError") {
    res.status(401).send({
      errors: [new InvalidCredentialsError()]
    });
  } else if (err.name === TokenExpiredError.name) {
    res.status(401).send({
      // TODO: look into, passing an error like this works just fine, but under graphql
      // we have tp spread it
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
