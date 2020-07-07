import { IBlock } from "../../mongo/block";
import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import { getBlockRootBlockId } from "../block/utils";
import { PermissionDeniedError } from "../errors";
import { userIsPartOfOrg } from "../user/utils";
import { NoteDoesNotExistInBlockError } from "./errors";

export interface ICanReadNoteParameters {
  user: IUser;
  note: INote;
  block: IBlock;
}

async function canReadNote(props: ICanReadNoteParameters) {
  const { note, user, block } = props;

  if (note.blockId !== block.customId) {
    throw new NoteDoesNotExistInBlockError({
      blockType: block.type,
      name: note.name,
    });
  }

  if (user.rootBlockId === block.customId) {
    return true;
  }

  if (userIsPartOfOrg(user, getBlockRootBlockId(block))) {
    return true;
  }

  throw new PermissionDeniedError();
}

export default canReadNote;
