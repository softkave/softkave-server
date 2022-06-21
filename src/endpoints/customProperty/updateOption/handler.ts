import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organizations/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import ToPublicCustomData from "../utils";
import { UpdateOptionEndpoint } from "./types";
import { updateOptionJoiSchema } from "./validation";

const updateOption: UpdateOptionEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateOptionJoiSchema);
  const user = await context.session.getUser(context, instData);
  const option = await context.data.customOption.assertGetItem(
    ReusableDataQueries.byId(data.customId)
  );

  canReadOrganization(option.organizationId, user);
  const updatedOption = await context.data.customOption.updateItem(
    ReusableDataQueries.byId(option.customId),
    { ...data.data, updatedAt: getDate(), updatedBy: user.customId }
  );

  return {
    option: ToPublicCustomData.customOption(updatedOption),
  };
};

export default updateOption;
