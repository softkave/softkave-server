import {ICollaborationRequest} from '../../mongo/collaboration-request/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicCollaborationRequest = ConvertDatesToStrings<ICollaborationRequest>;
