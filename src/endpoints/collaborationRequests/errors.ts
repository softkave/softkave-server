import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorExistsError extends OperationError {
  name = 'CollaboratorExistsError';
  message = 'Collaborator exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestExistsError extends OperationError {
  name = 'CollaborationRequestExistsError';
  message = 'Collaboration request exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
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
