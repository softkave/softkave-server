import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { IBoardSprintOptions } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { SprintsNotSetupYetError } from "../errors";
import { getPublicSprintOptions } from "../utils";
import { UpdateSprintOptionsEndpoint } from "./types";
import { updateSprintOptionsJoiSchema } from "./validation";

const updateSprintOptions: UpdateSprintOptionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateSprintOptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    assertBlock(board);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(board),
    //         resourceType: SystemResourceType.Board,
    //         action: SystemActionType.Update,
    //         permissionResourceId: board.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: board });

    if (!board.sprintOptions) {
        throw new SprintsNotSetupYetError();
    }

    const updatedAt = getDate();
    const sprintOptions: IBoardSprintOptions = {
        ...board.sprintOptions,
        ...data.data,
        updatedAt,
        updatedBy: user.customId,
    };

    // TODO: how can we update only the changed parts?
    const updatedBlock = await context.block.updateBlockById(
        context,
        board.customId,
        {
            sprintOptions,
        }
    );

    // TODO: update the rest of the sprints not started yet
    await context.sprint.updateUnstartedSprints(context, board.customId, {
        duration: data.data.duration,
    });

    context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
        block: board,
        updateType: { isUpdate: true },
        data: {
            sprintOptions,
        },
        blockId: board.customId,
        blockType: board.type,
        parentId: board.parent,
    });

    return {
        sprintOptions: getPublicSprintOptions(updatedBlock.sprintOptions),
    };
};

export default updateSprintOptions;
