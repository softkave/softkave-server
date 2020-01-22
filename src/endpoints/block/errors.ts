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
