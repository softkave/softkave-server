import { getBlockModel } from "../mongo/block";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

export async function removeDeletedBlocks() {
    logScriptStarted(removeDeletedBlocks);

    const blockModel = getBlockModel();

    try {
        await blockModel.waitTillReady();
        await blockModel.model
            .deleteMany({
                isDeleted: true,
            })
            .exec();
        logScriptSuccessful(removeDeletedBlocks);
    } catch (error) {
        logScriptFailed(removeDeletedBlocks, error);
    }
}
