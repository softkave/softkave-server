import Joi from "joi";
import { SystemResourceType } from "../models/system";
import { validationSchemas } from "../utilities/validationUtils";

const systemResourceType = Joi.string().valid([
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
]);

const parent = Joi.object().keys({
    type: systemResourceType.required(),
    customId: validationSchemas.uuid.required(),
});

const endpointValidationSchemas = { parent };

export default endpointValidationSchemas;
