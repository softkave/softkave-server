import { INotificationSubscription } from "../../mongo/notification";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicNotificationSubscription =
    ConvertDatesToStrings<INotificationSubscription>;
