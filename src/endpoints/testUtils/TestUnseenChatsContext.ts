import moment from "moment";
import { IUnseenChats } from "../../mongo/unseen-chats";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";
import UnseenChatsContext, {
    IUnseenChatsContext,
} from "../contexts/UnseenChatsContext";

const unseenChats: IUnseenChats[] = [];

class TestUnseenChatsContext
    extends UnseenChatsContext
    implements IUnseenChatsContext
{
    public addEntry = async (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => {
        const index = unseenChats.findIndex((item) => item.userId === userId);
        let data = unseenChats[index];

        if (index !== -1) {
            data = {
                userId,
                rooms: {},
                createdAt: getDateString(),
                customId: getNewId(),
            };

            unseenChats.push(data);
        }

        data.rooms[roomId] = (data.rooms[roomId] || 0) + 1;
        return data;
    };

    public removeEntry = async (ctx: IBaseContext, userId: string) => {
        unseenChats
            .reduce((indexes, item, i) => {
                if (item.userId === userId) {
                    indexes.push(i);
                }

                return indexes;
            }, [])
            .forEach((index) => unseenChats.splice(index, 1));
    };

    public consume = async (
        ctx: IBaseContext,
        count: number = 100,
        fromDate: string = moment().subtract(1, "days").toISOString()
    ) => {
        const fromDateMoment = moment(fromDate);
        const data: IUnseenChats[] = [];
        let i = 0;

        for (; i < unseenChats.length && data.length <= count; i++) {
            const item = unseenChats[i];

            if (moment(item.createdAt) >= fromDateMoment) {
                data.push(item);
            }
        }

        unseenChats.splice(0, i + 1);
        return data;
    };
}

export const getTestUnseenChatsContext = getSingletonFunc(
    () => new TestUnseenChatsContext()
);
