import { Request, Response } from "express";

import userError from "../endpoints/user/userError";
import jwtConstants from "../utils/jwtConstants";
import serverError from "../utils/serverError";

function handleErrors(err: Error | any, req: Request, res: Response) {
  if (err.name === jwtConstants.errorTypes.unauthorizedError) {
    res.status(200).send({
      errors: [userError.invalidCredentials]
    });
  } else if (err.name === jwtConstants.errorTypes.tokenExpired) {
    res.status(200).send({
      errors: [userError.credentialsExpired]
    });
  } else {
    res.status(500).send({
      errors: [serverError.serverError]
    });
  }

  // for debugging purposes
  // TODO: Log error in database, not console
  console.error(err);
}

export default handleErrors;
