import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

export class TaskExistsError extends OperationError {
  name = 'TaskExistsError';
  message = 'Task exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class TaskDoesNotExistError extends OperationError {
  name = 'TaskDoesNotExistError';
  message = 'Task does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
