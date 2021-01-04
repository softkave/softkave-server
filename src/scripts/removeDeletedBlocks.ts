import { getBlockModel } from "../mongo/block";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

export async function script_removeDeletedBlocks() {
    logScriptStarted(script_removeDeletedBlocks);

    const blockModel = getBlockModel();

    try {
        await blockModel.waitTillReady();
        await blockModel.model
            .deleteMany({
                isDeleted: true,
            })
            .exec();
        logScriptSuccessful(script_removeDeletedBlocks);
    } catch (error) {
        logScriptFailed(script_removeDeletedBlocks, error);
    }
}
