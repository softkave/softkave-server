import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { OrganizationDoesNotExistError } from "./errors";
import { IOrganization, IPublicOrganization } from "./types";

const publicOrganizationFields = getFields<IPublicOrganization>({
    customId: true,
    createdBy: true,
    createdAt: getDateString,
    type: true,
    name: true,
    description: true,
    updatedAt: getDateString,
    updatedBy: true,
    color: true,
});

export function getPublicOrganizationData(
    organization: Partial<IOrganization>
): IPublicOrganization {
    return extractFields(organization, publicOrganizationFields);
}

export function getPublicOrganizationsArray(
    organizations: Array<Partial<IOrganization>>
): IPublicOrganization[] {
    return organizations.map((organization) =>
        extractFields(organization, publicOrganizationFields)
    );
}

export function throwOrganizationNotFoundError() {
    throw new OrganizationDoesNotExistError();
}

export function assertOrganization(board?: IOrganization | null) {
    if (!board) {
        throwOrganizationNotFoundError();
    }
}
