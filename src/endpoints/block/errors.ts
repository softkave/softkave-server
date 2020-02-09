import { BlockType } from "mongo/block";
import OperationError, {
  IOperationErrorParameters
} from "../../utils/OperationError";

export interface IBlockExistsErrorParameters extends IOperationErrorParameters {
  blockType?: BlockType;
}

export class BlockExistsError extends OperationError {
  public name = "BlockExistsError";
  public message = "This email address is not available";

  constructor(p: IBlockExistsErrorParameters) {
    super(p);
    this.message = `${this.getTypeName(p.blockType)} exists`;
  }

  private getTypeName(blockType?: BlockType) {
    switch (blockType) {
      case "group":
        return "Group";

      case "org":
        return "Organization";

      case "task":
        return "Task";

      case "project":
        return "Project";

      case "root":
      default:
        return "Block";
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorExistsInOrgError extends OperationError {
  public name = "CollaboratorExistsInOrgError";
  public message =
    "A collaborator with this email address exists in this organization";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestSentBeforeError extends OperationError {
  public name = "CollaborationRequestSentBeforeError";
  public message =
    "A collaboration request has been sent before to this email address";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestAcceptedAlreadyError extends OperationError {
  public name = "CollaborationRequestAcceptedAlreadyError";
  public message = "This collaboration request has been accepted already";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDeclinedAlreadyError extends OperationError {
  public name = "CollaborationRequestDeclinedAlreadyError";
  public message = "This collaboration request has been declined already";
}

// tslint:disable-next-line: max-classes-per-file
export class DraggedBlockDoesNotExistInSourceBlockError extends OperationError {
  public name = "DraggedBlockDoesNotExistInSourceBlockError";
  public message = "The dragged block does not exist in the source block";
}
