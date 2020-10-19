import { ISprint } from "../../../mongo/sprint";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { SprintsNotSetupYetError, SprintWithNameExistsError } from "../errors";
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

    if (data.name) {
        const sprintWithNameExists = await context.sprint.sprintExists(
            context,
            data.name,
            data.boardId
        );

        if (sprintWithNameExists) {
            throw new SprintWithNameExistsError();
        }
    }

    const sprintsCount = await context.sprint.countSprints(
        context,
        data.boardId
    );

    let sprint: ISprint = {
        customId: getNewId(),
        boardId: data.boardId,
        orgId: board.rootBlockId,
        duration: board.sprintOptions.duration,
        sprintIndex: sprintsCount,
        name: data.name,
        createdAt: getDate(),
        createdBy: user.customId,
    };

    sprint = await context.sprint.saveSprint(context, sprint);

    return { sprint };
};

export default addSprint;
