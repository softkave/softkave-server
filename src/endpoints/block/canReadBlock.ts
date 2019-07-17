import { IUser } from "../user/user";
import userError from "../user/userError";
import { IBlock } from "./block";
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

  throw userError.permissionDenied;
}

export default canReadBlock;
