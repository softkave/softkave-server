import {Request, Response} from 'express';
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from 'jsonwebtoken';
import {CredentialsExpiredError, InvalidCredentialsError} from '../endpoints/user/errors';
import {ServerError} from '../utilities/errors';

export function resolveJWTError(err: Error) {
  switch (err.name) {
    case JsonWebTokenError.name:
    case 'UnauthorizedError':
    case NotBeforeError.name: // TODO: should this be resolved as invalid?
      return new InvalidCredentialsError();
    case TokenExpiredError.name:
      return new CredentialsExpiredError();
  }
  return undefined;
}

function handleErrors(err: Error | any, req: Request, res: Response, next: any) {
  const JWTError = resolveJWTError(err);
  if (JWTError) {
    res.status(401).send({
      errors: [JWTError],
    });
  } else {
    res.status(500).send({
      errors: [new ServerError()],
    });
  }

  console.error(err);
}

export default handleErrors;
