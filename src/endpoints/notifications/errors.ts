import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class NotificationDoesNotExistError extends OperationError {
  name = 'NotificationDoesNotExistError';
  message = 'Notification does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
