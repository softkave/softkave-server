const statusFulfilled = "fulfilled";
const statusRejected = "rejected";

export type PromiseStatus = typeof statusRejected | typeof statusFulfilled;

export const promiseStatus: { [key: string]: PromiseStatus } = {
    fulfilled: statusFulfilled,
    rejected: statusRejected,
};

export interface IAllSettledPromiseArgument {
    promise: Promise<any>;
    id: string;
}

export interface ISettledPromise {
    status: PromiseStatus;
    id: string;
    value?: any;
    reason?: any;
}

const waitOnPromises = (
    promises: IAllSettledPromiseArgument[]
): Promise<ISettledPromise[]> => {
    return Promise.all(
        promises.map((promise) => {
            return new Promise<ISettledPromise>((resolve) => {
                promise.promise
                    .then((result) =>
                        resolve({
                            status: statusFulfilled,
                            value: result,
                            id: promise.id,
                        })
                    )
                    .catch((error) =>
                        resolve({
                            status: statusRejected,
                            reason: error,
                            id: promise.id,
                        })
                    );
            });
        })
    );
};

export default waitOnPromises;
