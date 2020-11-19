export type SingletonFnInit<Singleton, Arguments extends any[]> = (
    ...args: Arguments
) => Singleton;

export default function makeSingletonFunc<Singleton, Arguments extends any[]>(
    init: SingletonFnInit<Singleton, Arguments>
): SingletonFnInit<Singleton, Arguments> {
    let data = null;

    return (...args: Arguments) => {
        if (!data) {
            data = init(...args);
        }

        return data;
    };
}
