import findLastIndex from "lodash/findLastIndex";
import moment from "moment";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { OutgoingSocketEvents } from "../socket/outgoingEventTypes";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

interface IBroadcastHistoryItem {
    event: OutgoingSocketEvents;
    data: any;
}

export interface IBroadcastHistoryFetchResult {
    rooms: { [key: string]: Array<{ event: OutgoingSocketEvents; data: any }> };
    reload?: boolean;
}

export interface IBroadcastHistoryContext {
    insert: (
        ctx: IBaseContext,
        room: string,
        item: IBroadcastHistoryItem
    ) => void;
    fetch: (
        ctx: IBaseContext,
        from: string,
        rooms: string[]
    ) => IBroadcastHistoryFetchResult;
}

interface IBroadcastHistoryTimestampItem {
    timestamp: Date;
    index: number;
}

const broadcastHistory = {} as { [key: string]: IBroadcastHistoryItem[] };
const broadcastHistoryTimestamps = {} as {
    [key: string]: IBroadcastHistoryTimestampItem[];
};

const maxRoomHistory = 1000;
const maxRoomHistorySliceFromIndex = 800;

/**
 * TODO: we're currently using memory store,
 * should we switch to mongodb or redis instead, for persistence,
 * or to prevent memory overloads?
 */

export default class BroadcastHistoryContext
    implements IBroadcastHistoryContext {
    public insert = wrapFireAndThrowError(
        (ctx: IBaseContext, room: string, item: IBroadcastHistoryItem) => {
            let roomTimestamps = broadcastHistoryTimestamps[room] || [];
            let roomHistory = broadcastHistory[room] || [];
            const now = new Date();

            roomTimestamps.push({
                index: roomTimestamps.length,
                timestamp: now,
            });
            roomHistory.push(item);

            if (roomHistory.length > maxRoomHistory) {
                roomHistory = roomHistory.slice(maxRoomHistorySliceFromIndex);
                roomTimestamps = roomTimestamps.slice(
                    maxRoomHistorySliceFromIndex
                );
            }

            broadcastHistoryTimestamps[room] = roomTimestamps;
            broadcastHistory[room] = roomHistory;
        }
    );

    public fetch = wrapFireAndThrowError(
        (ctx: IBaseContext, from: string, rooms: string[]) => {
            const fromDate = new Date(from);
            const result: IBroadcastHistoryFetchResult = { rooms: {} };

            if (moment(fromDate).add(1, "day") <= moment()) {
                result.reload = true;
                return result;
            }

            // TODO: should we use for (;;) instead, cause it's faster?
            for (const room of rooms) {
                const roomTimestamps = broadcastHistoryTimestamps[room] || [];
                const roomHistory = broadcastHistory[room] || [];
                result.rooms[room] = [];

                if (roomTimestamps.length === 0) {
                    continue;
                }

                if (roomTimestamps[0].timestamp > fromDate) {
                    result.reload = true;
                    result.rooms = {};
                    break;
                }

                if (
                    roomTimestamps[roomTimestamps.length - 1].timestamp <
                    fromDate
                ) {
                    continue;
                }

                // TODO: how can we binary search here, if it's faster
                let closestTimestampIndex = findLastIndex(
                    roomTimestamps,
                    (item) => {
                        if (item.timestamp < fromDate) {
                            return true;
                        }

                        return false;
                    }
                );

                if (closestTimestampIndex === -1) {
                    continue;
                }

                closestTimestampIndex += 1; // cause we want to start from the next item

                if (closestTimestampIndex >= roomTimestamps.length) {
                    continue;
                }

                const closestTimestamp = roomTimestamps[closestTimestampIndex];
                const updates = roomHistory.slice(closestTimestamp.index);
                result.rooms[room] = updates;
            }

            return result;
        }
    );
}

export const getBroadcastHistoryContext = makeSingletonFunc(
    () => new BroadcastHistoryContext()
);
