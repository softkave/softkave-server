import { BlockType } from "../../mongo/block";
import OperationError, {
    IOperationErrorParameters,
} from "../../utilities/OperationError";
import { getBlockTypeName } from "./utils";

export interface IBlockExistsErrorParameters extends IOperationErrorParameters {
    blockType?: BlockType;
}

export class BlockExistsError extends OperationError {
    public name = "BlockExistsError";
    public message = "Block exists";

    constructor(p: IBlockExistsErrorParameters) {
        super(p);
        this.message = `${getBlockTypeName(p.blockType)} exists`;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorExistsInOrganizationError extends OperationError {
    public name = "CollaboratorExistsInOrganizationError";
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
export class BlockDoesNotExistError extends OperationError {
    public name = "BlockDoesNotExistError";
    public message = "Block does not exist";
}
