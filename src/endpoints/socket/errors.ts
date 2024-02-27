import OperationError, { IOperationErrorParameters } from '../../utilities/OperationError';

export class SocketOnlyEndpointError extends OperationError {
  name = 'SocketOnlyEndpointError';
  message = 'Requested endpoint is a socket-only endpoint';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

export class NoSocketConnectionError extends OperationError {
  name = 'NoSocketConnectionError';
  message = 'Socket connection not found';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
