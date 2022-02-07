import { IUser } from "../../mongo/user";
import { extractFields, getFields } from "../utils";
import { ICollaborator } from "./types";

const collaboratorFields = getFields<ICollaborator>({
    customId: true,
    name: true,
    email: true,
    color: true,
});

export function getCollaboratorDataFromUser(user: IUser): ICollaborator {
    return extractFields(user, collaboratorFields);
}

export function getCollaboratorsArray(
    users: Array<ICollaborator | IUser>
): ICollaborator[] {
    return users.map((user) => extractFields(user, collaboratorFields));
}
