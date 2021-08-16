import getSingletonFunc from "../../../utilities/createSingletonFunc";
import InternalAddBlockContext from "../internalAddBlock/context";
import internalAddBlock from "../internalAddBlock/internalAddBlock";
import { IAddBlockContext } from "./types";

export default class AddBlockContext
    extends InternalAddBlockContext
    implements IAddBlockContext
{
    public async addBlock(context, instData) {
        return await internalAddBlock(context, instData);
    }
}

export const getAddBlockContext = getSingletonFunc(() => new AddBlockContext());
