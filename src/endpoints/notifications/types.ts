import {INotificationSubscription} from '../../mongo/notification/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicNotificationSubscription = ConvertDatesToStrings<INotificationSubscription>;
