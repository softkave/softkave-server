import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';
import {ServerRecommendedActions} from '../types';

export class EmailAddressNotAvailableError extends OperationError {
  name = 'EmailAddressNotAvailableError';
  message = 'Email address is not available';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidCredentialsError extends OperationError {
  name = 'InvalidCredentialsError';
  message = 'Invalid credentials';
  action = ServerRecommendedActions.LOGIN_AGAIN;
}

// tslint:disable-next-line: max-classes-per-file
export class CredentialsNotFoundError extends OperationError {
  name = 'CredentialsNotFoundError';
  message = 'Credentials not found';
  action = ServerRecommendedActions.LOGIN_AGAIN;
}

// tslint:disable-next-line: max-classes-per-file
export class CredentialsExpiredError extends OperationError {
  name = 'CredentialsExpiredError';
  message = 'Credentials expired';
  action = ServerRecommendedActions.LOGIN_AGAIN;
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidEmailAddressError extends OperationError {
  name = 'InvalidEmailAddressError';
  message = 'Email address is invalid';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidEmailOrPasswordError extends OperationError {
  name = 'InvalidEmailOrPasswordError';
  message = 'Invalid email or password';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class LoginAgainError extends OperationError {
  name = 'LoginAgainError';
  message = 'Please login again';
  action = ServerRecommendedActions.LOGIN_AGAIN;
}

// tslint:disable-next-line: max-classes-per-file
export class UserDoesNotExistError extends OperationError {
  name = 'UserDoesNotExistError';
  message = 'User does not exist';
  action = ServerRecommendedActions.LOGOUT;
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDoesNotExistError extends OperationError {
  name = 'CollaborationRequestDoesNotExistError';
  message = 'Collaboration request does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class NotificationDoesNotExistError extends OperationError {
  name = 'NotificationDoesNotExistError';
  message = 'Notification does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestHasExpiredError extends OperationError {
  name = 'CollaborationRequestHasExpiredError';
  message = 'Collaboration request has expired';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestAcceptedError extends OperationError {
  name = 'CollaborationRequestAcceptedError';
  message = 'Collaboration request has been accepted';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDeclinedError extends OperationError {
  name = 'CollaborationRequestDeclinedError';
  message = 'Collaboration request has been declined';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestRevokedError extends OperationError {
  name = 'CollaborationRequestRevokedError';
  message = 'Collaboration request has been revoked';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class IncorrectPasswordError extends OperationError {
  name = 'IncorrectPasswordError';
  message = 'The password you entered is incorrect';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
