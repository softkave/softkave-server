import OperationError, { IOperationErrorParameters } from '../../utilities/OperationError';

export class OrganizationExistsError extends OperationError {
  name = 'OrganizationExistsError';

  // TODO: replace your email with a config provided email
  message =
    'Organization exists. If this organization legally belongs to you, ' +
    'you can send a complaint to abayomi@softkave.com';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class OrganizationDoesNotExistError extends OperationError {
  name = 'OrganizationDoesNotExistError';
  message = 'Organization does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
