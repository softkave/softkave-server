import { IUser } from "../../mongo/user";
import { PermissionDeniedError } from "../errors";
import { userIsPartOfOrganization } from "../user/utils";

function canReadOrganization(organizationId: string, user: IUser) {
    if (userIsPartOfOrganization(user, organizationId)) {
        return true;
    }

    throw new PermissionDeniedError();
}

export default canReadOrganization;
