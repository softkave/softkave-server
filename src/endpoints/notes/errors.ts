import defaultTo from "lodash";
import { BlockType } from "../../mongo/block";
import { ternaryOp } from "../../utilities/fns";
import OperationError, {
  IOperationErrorParameters,
} from "../../utilities/OperationError";
import { getBlockTypeName } from "../block/utils";

export interface INoteExistsErrorParameters extends IOperationErrorParameters {
  blockType?: BlockType;
  name?: string;
}

// TODO: should we add the name of the note, and block
// TODO: also in block

export class NoteExistsError extends OperationError {
  public name = "NoteExistsError";
  public message = "A note with this same exists in this context.";

  constructor(p: INoteExistsErrorParameters) {
    super(p);
    this.message = `Note ${ternaryOp(
      p.name,
      p.name + " ",
      " "
    )}exists in this ${getBlockTypeName(p.blockType)}`;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class NoteDoesNotExistError extends OperationError {
  public name = "NoteDoesNotExistError";
  public message = "Note does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class NoteDoesNotExistInBlockError extends OperationError {
  public name = "NoteDoesNotExistError";
  public message = "Note does not exist in block";

  constructor(p: INoteExistsErrorParameters) {
    super(p);
    this.message = `Note ${ternaryOp(
      p.name,
      p.name + " ",
      " "
    )}does not exist in ${getBlockTypeName(p.blockType)}`;
  }
}
