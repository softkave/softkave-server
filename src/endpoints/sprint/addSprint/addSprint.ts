import { IBoardSprintDefinition, ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintsNotSetupYetError, SprintsSetupAldreadyError } from "../errors";
import { AddSprintEndpoint } from "./types";
import { addSprintJoiSchema } from "./validation";

const addSprint: AddSprintEndpoint = async (context, instData) => {
    const data = validate(instData.data, addSprintJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.getBlockById(context, data.boardId);

    await canReadBlock({ user, block: board });

    if (!board.sprintOptions) {
        throw new SprintsNotSetupYetError();
    }

    const now = new Date();

    const previousSprint;
    const sprint: ISprint = {
        customId: getId(),
        createdAt: getDate(now),
        createdBy: user.customId,
        duration: board.sprintOptions.duration,
        parentId: data.boardId,
        estimatedStartYear: now.getFullYear(),
        overallIteration: 1,
        rootBlockId: board.rootBlockId,
        yearIteration: 1,
    };

    return await context.sprint.saveSprint(context, sprint);
};

export default addSprint;
