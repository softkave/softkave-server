import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getPublicCommentsArray } from "../utils";
import { GetCommentsEndpoint } from "./types";
import { getCommentsJoiSchema } from "./validation";

const getComments: GetCommentsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getCommentsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const task = await context.block.getBlockById(context, data.taskId);

    canReadBlock({ user, block: task });

    const comments = await context.comment.getComments(context, data.taskId);

    return {
        comments: getPublicCommentsArray(comments),
    };
};

export default getComments;
