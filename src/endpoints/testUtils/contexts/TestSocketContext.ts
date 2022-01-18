import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { IBaseContext } from "../../contexts/IBaseContext";
import SocketContext, { ISocketContext } from "../../contexts/SocketContext";

interface ITestSocketContextListener {
    socketId: string;
    cb: (eventName: string, data: any) => void;
}

export interface ITestSocketContext extends ISocketContext {
    addListener: (
        socketId: string,
        cb: ITestSocketContextListener["cb"]
    ) => void;
    removeListener: (socketId: string) => void;
}

const listeners: ITestSocketContextListener[] = [];

function findListenerIndex(socketId: string) {
    return listeners.findIndex((entry) => entry.socketId === socketId);
}

function findListener(socketId: string) {
    return listeners.find((entry) => entry.socketId === socketId);
}

function deleteListener(socketId: string) {
    const index = findListenerIndex(socketId);

    if (index !== -1) {
        listeners.splice(index, 1);
    }
}

class TestSocketContext extends SocketContext implements ITestSocketContext {
    public broadcastToSocket(
        ctx: IBaseContext,
        socketId: string,
        eventName: string,
        data: any
    ) {
        const socket = ctx.socketServerInstance.to(socketId);

        if (socket) {
            socket.emit(eventName, data);
            return true;
        }

        return false;
    }

    public addListener(socketId: string, cb: ITestSocketContextListener["cb"]) {
        if (!findListener(socketId)) {
            listeners.push({ socketId, cb });
        }
    }

    public removeListener(socketId: string) {
        deleteListener(socketId);
    }
}

export const getTestSocketContext = makeSingletonFn(
    () => new TestSocketContext()
);
