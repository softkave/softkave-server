import { IUser } from "mongo/user";
import { IBlock } from "../../mongo/block";
import { PermissionDeniedError } from "../errors";
import { blockConstants } from "./constants";
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

  let orgID = null;

  if (block.type === blockConstants.blockTypes.org) {
    orgID = block.customId;
  } else {
    orgID = block.rootBlockID;
  }

  if (orgID) {
    if (user.orgs.indexOf(orgID) !== -1) {
      return true;
    }
  }

  throw new PermissionDeniedError();
}

export default canReadBlock;
