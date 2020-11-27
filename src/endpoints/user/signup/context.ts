import CreateRootBlockContext from "../../block/createRootBlock/context";
import createRootBlock from "../../block/createRootBlock/createRootBlock";
import userExists from "../userExists/userExists";
import { ISignupContext } from "./types";

export default class SignupContext
    extends CreateRootBlockContext
    implements ISignupContext {
    public async createUserRootBlock(context, instData) {
        return await createRootBlock(context, instData);
    }
}

let cxt: ISignupContext = null;

export function getSignupContext() {
    if (cxt) {
        return cxt;
    }

    cxt = new SignupContext();

    return cxt;
}
