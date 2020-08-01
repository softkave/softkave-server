import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetNotesEndpoint } from "./types";
import { getNotesJoiSchema } from "./validation";

const getNotes: GetNotesEndpoint = async (context, instData) => {
  const data = validate(instData.data, getNotesJoiSchema);
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, data.blockId);

  canReadBlock({ user, block });

  const notes = await context.note.getNotesByBlockId(context, data.blockId);

  return {
    notes,
  };
};

export default getNotes;
