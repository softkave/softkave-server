import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorDoesNotExistError extends OperationError {
  name = 'CollaboratorDoesNotExistError';
  message = 'Collaborator does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
