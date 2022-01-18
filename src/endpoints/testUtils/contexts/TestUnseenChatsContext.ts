import moment from "moment";
import { IUnseenChats } from "../../../mongo/unseen-chats";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IBaseContext } from "../../contexts/IBaseContext";
import UnseenChatsContext, {
    IUnseenChatsContext,
} from "../../contexts/UnseenChatsContext";

class TestUnseenChatsContext
    extends UnseenChatsContext
    implements IUnseenChatsContext
{
    unseenChats: IUnseenChats[] = [];

    public addEntry = async (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => {
        const index = this.unseenChats.findIndex(
            (item) => item.userId === userId
        );
        let data = this.unseenChats[index];

        if (index !== -1) {
            data = {
                userId,
                rooms: {},
                createdAt: getDateString(),
                customId: getNewId(),
            };

            this.unseenChats.push(data);
        }

        data.rooms[roomId] = (data.rooms[roomId] || 0) + 1;
        return data;
    };

    public removeEntry = async (ctx: IBaseContext, userId: string) => {
        this.unseenChats
            .reduce((indexes, item, i) => {
                if (item.userId === userId) {
                    indexes.push(i);
                }

                return indexes;
            }, [])
            .forEach((index) => this.unseenChats.splice(index, 1));
    };

    public consume = async (
        ctx: IBaseContext,
        count: number = 100,
        fromDate: string = moment().subtract(1, "days").toISOString()
    ) => {
        const fromDateMoment = moment(fromDate);
        const data: IUnseenChats[] = [];
        let i = 0;

        for (; i < this.unseenChats.length && data.length <= count; i++) {
            const item = this.unseenChats[i];

            if (moment(item.createdAt) >= fromDateMoment) {
                data.push(item);
            }
        }

        this.unseenChats.splice(0, i + 1);
        return data;
    };
}

export const getTestUnseenChatsContext = makeSingletonFn(
    () => new TestUnseenChatsContext()
);
