import { getBlockModel } from "../mongo/block";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

export async function script_moveFutureProjects() {
    logScriptStarted(script_moveFutureProjects);

    const blockModel = getBlockModel();
    await blockModel.waitTillReady();

    const futureProjectsBoardId = "b4ece777-f89f-4e3f-8317-107a0e12a0ab";
    const solomonAndSonsOrgId = "9507159e-324f-410d-bfb0-5e35db03e9c2";

    try {
        await blockModel.model
            .updateMany(
                {
                    customId: futureProjectsBoardId,
                },
                {
                    parent: solomonAndSonsOrgId,
                    rootBlockId: solomonAndSonsOrgId,
                }
            )
            .exec();

        await blockModel.model
            .updateMany(
                {
                    parent: futureProjectsBoardId,
                },
                {
                    rootBlockId: solomonAndSonsOrgId,
                }
            )
            .exec();

        logScriptSuccessful(script_moveFutureProjects);
    } catch (error) {
        logScriptFailed(script_moveFutureProjects, error);
    }
}
