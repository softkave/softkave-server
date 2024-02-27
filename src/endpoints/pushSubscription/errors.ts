import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class PushSubscriptionDoesNotExistError extends OperationError {
  name = 'PushSubscriptionDoesNotExistError';
  message = 'Push subscription does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class PushSubscriptionExistsError extends OperationError {
  name = 'PushSubscriptionExistsError';
  message = 'Push subscription exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
