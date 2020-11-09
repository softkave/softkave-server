import { INotification } from "../../mongo/notification";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicNotificationData = ConvertDatesToStrings<INotification>;
