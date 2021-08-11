import { IParentInformation } from "../mongo/definitions";
import { IBaseContext } from "./contexts/BaseContext";

export async function assertParent<T>(
    context: IBaseContext,
    parent: IParentInformation
) {
    return await context.block.assertGetBlockById<T>(context, parent.customId);
}
