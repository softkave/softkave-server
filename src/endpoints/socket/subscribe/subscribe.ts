import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "./types";
import { subscribeJoiSchema } from "./validation";

const subscribe: SubscribeEndpoint = async (context, instData) => {
  const data = validate(instData.data, subscribeJoiSchema);
  const user = await context.session.getUser(context.models, instData);
};

export default subscribe;
