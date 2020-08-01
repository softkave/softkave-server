import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { BlockDoesNotExistError } from "../../block/errors";
import canReadNote from "../canReadNote";
import { NoteExistsEndpoint } from "./types";
import { noteExistsJoiSchema } from "./validation";

const noteExists: NoteExistsEndpoint = async (context, instData) => {
  const data = validate(instData.data, noteExistsJoiSchema);
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, data.blockId);

  if (!block) {
    throw new BlockDoesNotExistError();
  }

  canReadBlock({ user, block });

  const note = await context.note.getNoteByName(
    context,
    data.name,
    data.blockId
  );

  canReadNote({ note, block, user });

  if (!note) {
    return false;
  }

  return true;
};

export default noteExists;
