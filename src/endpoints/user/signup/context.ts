import makeSingletonFunc from "../../../utilities/createSingletonFunc";
import CreateRootBlockContext from "../../block/createRootBlock/context";
import createRootBlock from "../../block/createRootBlock/createRootBlock";
import { ISignupContext } from "./types";

export default class SignupContext
    extends CreateRootBlockContext
    implements ISignupContext {
    public async createUserRootBlock(context, instData) {
        return await createRootBlock(context, instData);
    }
}

export const getSignupContext = makeSingletonFunc(() => new SignupContext());
