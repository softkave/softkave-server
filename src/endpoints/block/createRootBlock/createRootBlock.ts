import randomColor from "randomcolor";
import { BlockType } from "../../../mongo/block";
import { INewBlockInput } from "../types";
import { getPublicBlockData } from "../utils";
import { CreateRootBlockEndpoint } from "./types";

const createRootBlock: CreateRootBlockEndpoint = async (context, instData) => {
    const user = await instData.data.user;
    const rootBlockInput: INewBlockInput = {
        name: `root_${user.customId}`,
        color: randomColor(),
        type: BlockType.Root,
    };

    const result = await context.addBlock(context, {
        ...instData,
        data: { block: rootBlockInput },
    });

    const rootBlock = result.block;

    // TODO: should we remove the user if the root block fails?
    await context.session.updateUser(context, instData, {
        rootBlockId: rootBlock.customId,
    });

    return {
        block: getPublicBlockData(rootBlock),
    };
};

export default createRootBlock;
