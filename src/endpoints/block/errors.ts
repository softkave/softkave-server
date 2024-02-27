import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorExistsInOrganizationError extends OperationError {
  name = 'CollaboratorExistsInOrganizationError';
  message = 'A collaborator with this email address exists in this organization';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestSentBeforeError extends OperationError {
  name = 'CollaborationRequestSentBeforeError';
  message = 'A collaboration request has been sent before to this email address';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BlockDoesNotExistError extends OperationError {
  name = 'BlockDoesNotExistError';
  message = 'Block does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
