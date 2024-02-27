import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

export class BoardExistsError extends OperationError {
  name = 'BoardExistsError';
  message = 'Board exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BoardDoesNotExistError extends OperationError {
  name = 'BoardDoesNotExistError';
  message = 'Board does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
