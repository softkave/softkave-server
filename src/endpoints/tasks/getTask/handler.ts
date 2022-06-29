import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organizations/canReadBlock";
import { ITask } from "../types";
import { getPublicTaskData, throwTaskNotFoundError } from "../utils";
import { GetTaskEndpoint } from "./types";
import { getTaskJoiSchema } from "./validation";

const getTask: GetTaskEndpoint = async (context, instData) => {
  const data = validate(instData.data, getTaskJoiSchema);
  const user = await context.session.getUser(context, instData);
  const task = await context.block.assertGetBlockById<ITask>(
    context,
    data.taskId,
    throwTaskNotFoundError
  );

  canReadOrganization(task.rootBlockId, user);
  return {
    task: getPublicTaskData(task),
  };
};

export default getTask;
