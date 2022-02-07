import { BlockType, IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { PermissionDeniedError } from "../errors";
import { userIsPartOfOrganization } from "../user/utils";
import { BlockDoesNotExistError } from "./errors";

export interface ICanReadBlockParameters {
    user: IUser;
    block: {
        customId?: string;
        type?: BlockType;
        rootBlockId?: string;
    };
}

async function canReadBlock({ block, user }: ICanReadBlockParameters) {
    if (!block) {
        throw new BlockDoesNotExistError();
    }

    if (user.rootBlockId === block.customId) {
        return true;
    }

    let organizationId = null;

    if (block.type === BlockType.Organization) {
        organizationId = block.customId;
    } else {
        organizationId = block.rootBlockId;
    }

    if (organizationId) {
        if (userIsPartOfOrganization(user, organizationId)) {
            return true;
        }
    }

    throw new PermissionDeniedError();
}

export default canReadBlock;
