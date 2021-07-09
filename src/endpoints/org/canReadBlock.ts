import { IUser } from "../../mongo/user";
import { PermissionDeniedError } from "../errors";
import { userIsPartOfOrg } from "../user/utils";

async function canReadOrg(orgId: string, user: IUser) {
    if (userIsPartOfOrg(user, orgId)) {
        return true;
    }

    throw new PermissionDeniedError();
}

export default canReadOrg;
