import { validate } from "../../../utilities/joiUtils";
import { UpdateResourceSubscriptionsEndpoint } from "./types";
import { updateResourceSubscriptionsJoiSchema } from "./validation";

const updateResourceSubscriptions: UpdateResourceSubscriptionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateResourceSubscriptionsJoiSchema);
};

export default updateResourceSubscriptions;
