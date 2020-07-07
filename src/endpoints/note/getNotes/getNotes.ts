import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetNotesEndpoint } from "./types";
import { getNotesJoiSchema } from "./validation";

const getNotes: GetNotesEndpoint = async (context, instData) => {
  const data = validate(instData.data, getNotesJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.blockId);

  canReadBlock({ user, block });

  const notes = await context.note.getNotesByBlockId(
    context.models,
    data.blockId
  );

  return {
    notes,
  };
};

export default getNotes;
