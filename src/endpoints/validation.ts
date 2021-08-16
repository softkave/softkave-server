import Joi from "joi";
import { ParentResourceType, SystemResourceType } from "../models/system";
import { validationSchemas } from "../utilities/validationUtils";
import { endpointConstants } from "./constants";

const systemResourceTypeArray: SystemResourceType[] = [
    SystemResourceType.User,
    SystemResourceType.Collaborator,
    SystemResourceType.RootBlock,
    SystemResourceType.Organization,
    SystemResourceType.Board,
    SystemResourceType.Task,
    SystemResourceType.Status,
    SystemResourceType.Label,
    SystemResourceType.Resolution,
    SystemResourceType.Note,
    SystemResourceType.Comment,
    SystemResourceType.Room,
    SystemResourceType.Sprint,
    SystemResourceType.Chat,
    SystemResourceType.SubTask,
    SystemResourceType.CollaborationRequest,
    SystemResourceType.Notification,
    SystemResourceType.NotificationSubscription,
    SystemResourceType.Team,
    SystemResourceType.PermissionGroup,
    SystemResourceType.Permission,
    SystemResourceType.CustomProperty,
    SystemResourceType.CustomValue,
];

const systemResourceType = Joi.string().valid(systemResourceTypeArray);
const parentResourceTypeEnumArray: ParentResourceType[] = [
    ParentResourceType.Organization,
    ParentResourceType.Board,
];

const parentResourceType = Joi.string().valid(parentResourceTypeEnumArray);
const parent = Joi.object().keys({
    type: parentResourceType.required(),
    customId: validationSchemas.uuid.required(),
});

const parentArray = Joi.array().items(parent).max(endpointConstants.maxParents);
const endpointValidationSchemas = {
    parent,
    parentArray,
    systemResourceType,
    parentResourceType,
};

export default endpointValidationSchemas;
