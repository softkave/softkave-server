import { IUser } from "mongo/user";
import { IBlock } from "../../mongo/block";
import { PermissionDeniedError } from "../errors";
import { blockConstants } from "./constants";

export interface ICanReadBlockParameters {
  user: IUser;
  block: IBlock;
}

async function canReadBlock({ block, user }: ICanReadBlockParameters) {
  if (user.rootBlockId === block.customId) {
    return true;
  }

  let orgID = null;

  if (block.type === blockConstants.blockTypes.org) {
    orgID = block.customId;
  } else if (Array.isArray(block.parents) && block.parents.length > 0) {
    orgID = block.parents[0];
  }

  if (orgID) {
    if (user.orgs.indexOf(orgID) !== -1) {
      return true;
    }
  }

  throw new PermissionDeniedError();
}

export default canReadBlock;
