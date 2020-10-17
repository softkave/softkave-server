import { IBoardSprintDefinition, ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintsSetupAldreadyError } from "../errors";
import { SetupSprintsEndpoint } from "./types";
import { setupSprintsJoiSchema } from "./validation";

const setupSprints: SetupSprintsEndpoint = async (context, instData) => {
    const data = validate(instData.data, setupSprintsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    await canReadBlock({ user, block: board });

    if (board.currentSprintId) {
        throw new SprintsSetupAldreadyError();
    }

    const now = new Date();

    const sprintDefinition: IBoardSprintDefinition = {
        createdAt: getDate(now),
        createdBy: user.customId,
        duration: data.duration,
    };

    const sprint: ISprint = {
        ...sprintDefinition,
        customId: getId(),
        parentId: data.boardId,
        estimatedStartYear: now.getFullYear(),
        overallIteration: 1,
        rootBlockId: board.rootBlockId,
        yearIteration: 1,
    };

    await context.block.updateBlockById(context, board.customId, {
        sprintOptions: sprintDefinition,
    });

    return await context.sprint.saveSprint(context, sprint);
};

export default setupSprints;
