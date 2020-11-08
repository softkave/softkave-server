export interface IPromiseWithId<T = any> {
    promise: Promise<T>;
    id: string | number;
}

export interface ISettledPromise<V = any, R = any> {
    fulfilled: boolean;
    rejected: boolean;
    id: string | number;
    value?: V;
    reason?: R;
}

const waitOnPromises = (
    promises: IPromiseWithId[]
): Promise<ISettledPromise[]> => {
    return Promise.all(
        promises.map((promise) => {
            return new Promise<ISettledPromise>((resolve) => {
                promise.promise
                    .then((result) =>
                        resolve({
                            fulfilled: true,
                            rejected: false,
                            value: result,
                            id: promise.id,
                        })
                    )
                    .catch((error) =>
                        resolve({
                            fulfilled: false,
                            rejected: true,
                            reason: error,
                            id: promise.id,
                        })
                    );
            });
        })
    );
};

export default waitOnPromises;
