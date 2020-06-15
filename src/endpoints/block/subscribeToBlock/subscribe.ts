import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { SubscribeToBlockEndpoint } from "./types";
import { subscribeToBlockJoiSchema } from "./validation";

const subscribe: SubscribeToBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, subscribeToBlockJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.blockId);

  canReadBlock({ user, block });
};

export default subscribe;
