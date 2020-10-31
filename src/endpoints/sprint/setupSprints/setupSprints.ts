import { IBoardSprintOptions } from "../../../mongo/sprint";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import broadcastBlockUpdate from "../../block/broadcastBlockUpdate";
import canReadBlock from "../../block/canReadBlock";
import { fireAndForgetPromise } from "../../utils";
import { SprintsSetupAldreadyError } from "../errors";
import { SetupSprintsEndpoint } from "./types";
import { setupSprintsJoiSchema } from "./validation";

const setupSprints: SetupSprintsEndpoint = async (context, instData) => {
    const data = validate(instData.data, setupSprintsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    await canReadBlock({ user, block: board });

    if (!!board.sprintOptions) {
        throw new SprintsSetupAldreadyError();
    }

    const sprintOptions: IBoardSprintOptions = {
        createdAt: getDate(),
        createdBy: user.customId,
        duration: data.data.duration,
    };

    await context.block.updateBlockById(context, board.customId, {
        sprintOptions,
    });

    fireAndForgetPromise(
        broadcastBlockUpdate({
            block: board,
            context,
            instData,
            updateType: { isUpdate: true },
            data: {
                sprintOptions,
            },
            blockId: board.customId,
            blockType: board.type,
            parentId: board.parent,
        })
    );

    return {
        data: {
            createdAt: getDateString(sprintOptions.createdAt),
        },
    };
};

export default setupSprints;
