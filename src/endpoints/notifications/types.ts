import { ICollaborationRequest } from "../../mongo/collaborationRequest";
import {
    INotification,
    INotificationSubscription,
} from "../../mongo/notification";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicNotificationData = ConvertDatesToStrings<INotification>;
export type IPublicNotificationSubscription = ConvertDatesToStrings<INotificationSubscription>;
export type IPublicCollaborationRequest = ConvertDatesToStrings<ICollaborationRequest>;
