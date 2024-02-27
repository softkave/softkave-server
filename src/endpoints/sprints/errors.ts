import OperationError, {IOperationErrorParameters} from '../../utilities/OperationError';

// tslint:disable-next-line: max-classes-per-file
export class SprintsNotSetupYetError extends OperationError {
  name = 'SprintsNotSetupYetError';
  message = 'Please setup sprints in board first';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class SprintsSetupAldreadyError extends OperationError {
  name = 'SprintsSetupAldreadyError';
  message = 'Sprints are already setup in this board';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class SprintDoesNotExistError extends OperationError {
  name = 'SprintDoesNotExistError';
  message = 'Sprint does not exist';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class SprintWithNameExistsError extends OperationError {
  name = 'SprintWithNameExistsError';
  message = 'Sprint with name provided exists';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CannotDeleteCurrentOrPastSprintError extends OperationError {
  name = 'CannotDeleteCurrentOrPastSprintError';
  message = 'Cannot delete current or ended sprints';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CannotRestartCurrentOrPastSprintsError extends OperationError {
  name = 'CannotRestartCurrentOrPastSprintsError';
  message = 'Cannot restart current or past sprints';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CannotStartSprintCauseCurrentSprintExistsError extends OperationError {
  name = 'CannotStartSprintCauseCurrentSprintExistsError';
  message = 'Please end the current sprint before starting a new one';

  constructor(props?: IOperationErrorParameters | string) {
    super();
    this.applyProps(props);
  }
}
