import { BlockType, IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { PermissionDeniedError } from "../errors";
import { userIsPartOfOrg } from "../user/utils";
import { BlockDoesNotExistError } from "./errors";

export interface ICanReadBlockParameters {
    user: IUser;
    block: IBlock;
}

async function canReadBlock({ block, user }: ICanReadBlockParameters) {
    if (!block) {
        throw new BlockDoesNotExistError();
    }

    if (user.rootBlockId === block.customId) {
        return true;
    }

    let orgId = null;

    if (block.type === BlockType.Org) {
        orgId = block.customId;
    } else {
        orgId = block.rootBlockId;
    }

    if (orgId) {
        if (userIsPartOfOrg(user, orgId)) {
            return true;
        }
    }

    throw new PermissionDeniedError();
}

export default canReadBlock;
