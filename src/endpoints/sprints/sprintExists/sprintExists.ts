import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { SprintExistsEndpoint } from "./types";
import { sprintExistsJoiSchema } from "./validation";

const sprintExists: SprintExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, sprintExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    if (!board) {
        return { exists: false };
    }

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(board),
            resourceType: SystemResourceType.Board,
            action: SystemActionType.Read,
            permissionResourceId: board.permissionResourceId,
        },
        user
    );

    const doesSprintExist = await context.sprint.sprintExists(
        context,
        data.name,
        data.boardId
    );

    return { exists: doesSprintExist };
};

export default sprintExists;
