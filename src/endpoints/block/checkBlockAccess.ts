import { assertBlock } from "../../mongo/block/utils";
import { IUser } from "../../mongo/user";
import { IBaseContext } from "../contexts/IBaseContext";
import canReadBlock from "./canReadBlock";

export async function checkBlockAccess(
    context: IBaseContext,
    blockId: string,
    user: IUser
) {
    const block = await context.block.getBlockById(context, blockId);
    assertBlock(block);
    canReadBlock({ user, block });
    return block;
}
