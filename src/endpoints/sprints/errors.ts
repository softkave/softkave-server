import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class SprintsNotSetupYetError extends OperationError {
    public name = "SprintsNotSetupYetError";
    public message = "Please setup sprints in board first";
}

// tslint:disable-next-line: max-classes-per-file
export class SprintsSetupAldreadyError extends OperationError {
    public name = "SprintsSetupAldreadyError";
    public message = "Sprints are already setup in this board";
}

// tslint:disable-next-line: max-classes-per-file
export class SprintDoesNotExistError extends OperationError {
    public name = "SprintDoesNotExistError";
    public message = "Sprint does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class SprintWithNameExistsError extends OperationError {
    public name = "SprintWithNameExistsError";
    public message = "Sprint with name provided exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CannotDeleteCurrentOrPastSprintError extends OperationError {
    public name = "CannotDeleteCurrentOrPastSprintError";
    public message = "Cannot delete current or ended sprints";
}

// tslint:disable-next-line: max-classes-per-file
export class CannotRestartCurrentOrPastSprintsError extends OperationError {
    public name = "CannotRestartCurrentOrPastSprintsError";
    public message = "Cannot restart current or past sprints";
}

// tslint:disable-next-line: max-classes-per-file
export class CannotStartSprintCauseCurrentSprintExistsError extends OperationError {
    public name = "CannotStartSprintCauseCurrentSprintExistsError";
    public message = "Please end the current sprint before starting a new one";
}
