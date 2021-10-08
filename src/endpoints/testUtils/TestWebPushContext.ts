import { RequestOptions } from "web-push";
import { IClient } from "../../mongo/client";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { IBaseContext } from "../contexts/BaseContext";
import { IWebPushContext } from "../contexts/WebPushContext";

interface ITestWebPushContextListener {
    endpoint: string;
    keys: IClient["keys"];
    cb: (message: string | Buffer) => void;
}

export interface ITestWebPushContext extends IWebPushContext {
    addListener: (
        endpoint: string,
        keys: IClient["keys"],
        cb: ITestWebPushContextListener["cb"]
    ) => void;
    removeListener: (endpoint: string, keys: IClient["keys"]) => void;
}

const listeners: ITestWebPushContextListener[] = [];

function findListenerIndex(endpoint: string, keys: IClient["keys"]) {
    return listeners.findIndex(
        (entry) =>
            entry.endpoint === endpoint &&
            entry.keys.auth === keys.auth &&
            entry.keys.p256dh === keys.p256dh
    );
}

function findListener(endpoint: string, keys: IClient["keys"]) {
    return listeners.find(
        (entry) =>
            entry.endpoint === endpoint &&
            entry.keys.auth === keys.auth &&
            entry.keys.p256dh === keys.p256dh
    );
}

function deleteListener(endpoint: string, keys: IClient["keys"]) {
    const index = findListenerIndex(endpoint, keys);

    if (index !== -1) {
        listeners.splice(index, 1);
    }
}

class TestWebPushContext implements ITestWebPushContext {
    sendNotification = async (
        ctx: IBaseContext,
        endpoint: string,
        keys: IClient["keys"],
        message?: string | Buffer | null,
        options?: RequestOptions
    ) => {
        return await ctx.webPushInstance.sendNotification(
            { endpoint, keys },
            message,
            options
        );
    };

    public addListener(
        endpoint: string,
        keys: IClient["keys"],
        cb: ITestWebPushContextListener["cb"]
    ) {
        if (!findListener(endpoint, keys)) {
            listeners.push({ endpoint, keys, cb });
        }
    }

    public removeListener(endpoint: string, keys: IClient["keys"]) {
        deleteListener(endpoint, keys);
    }
}

export const getTestWebPushContext = makeSingletonFn(
    () => new TestWebPushContext()
);
