import {IBoardSprintOptions, ISprint} from '../../mongo/sprint/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicSprint = ConvertDatesToStrings<ISprint>;
export type IPublicSprintOptions = ConvertDatesToStrings<IBoardSprintOptions>;
