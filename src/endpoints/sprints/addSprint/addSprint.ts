import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { SprintsNotSetupYetError, SprintWithNameExistsError } from "../errors";
import { getPublicSprintData } from "../utils";
import { AddSprintEndpoint } from "./types";
import { addSprintJoiSchema } from "./validation";

const addSprint: AddSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, addSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    assertBlock(board);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Sprint,
    //         action: SystemActionType.Create,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    if (!board.sprintOptions) {
        throw new SprintsNotSetupYetError();
    }

    const sprintWithNameExists = await context.sprint.sprintExists(
        context,
        data.data.name,
        data.boardId
    );

    if (sprintWithNameExists) {
        throw new SprintWithNameExistsError();
    }

    let prevSprint: ISprint;

    if (board.lastSprintId) {
        prevSprint = await context.sprint.getSprintById(
            context,
            board.lastSprintId
        );
    }

    let sprint: ISprint = {
        customId: getNewId(),
        boardId: data.boardId,
        orgId: board.rootBlockId,
        duration: data.data.duration,
        name: data.data.name,
        createdAt: getDate(),
        createdBy: user.customId,
        prevSprintId: prevSprint?.customId,
        sprintIndex: (prevSprint?.sprintIndex || 0) + 1,
    };

    // TODO: can we bulk update these?
    sprint = await context.sprint.saveSprint(context, sprint);

    if (board.lastSprintId) {
        await context.sprint.updateSprintById(context, board.lastSprintId, {
            nextSprintId: sprint.customId,
        });
    }

    const boardUpdates: Partial<IBlock> = {
        lastSprintId: sprint.customId,
    };

    await context.block.updateBlockById(context, board.customId, boardUpdates);

    const publicSprint = getPublicSprintData(sprint);

    context.broadcastHelpers.broadcastNewSprint(
        context,
        instData,
        board,
        publicSprint
    );

    return { sprint: publicSprint };
};

export default addSprint;
