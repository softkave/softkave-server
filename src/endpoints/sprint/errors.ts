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
