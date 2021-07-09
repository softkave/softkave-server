import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { OrgDoesNotExistError } from "./errors";
import { IOrganization, IPublicOrg } from "./types";

const publicOrgFields = getFields<IPublicOrg>({
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

export function getPublicOrgData(org: Partial<IOrganization>): IPublicOrg {
    return extractFields(org, publicOrgFields);
}

export function getPublicOrgsArray(
    orgs: Array<Partial<IOrganization>>
): IPublicOrg[] {
    return orgs.map((org) => extractFields(org, publicOrgFields));
}

export function throwOrgNotFoundError() {
    throw new OrgDoesNotExistError();
}
