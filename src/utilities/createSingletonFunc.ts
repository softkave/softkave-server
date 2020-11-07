export type SingletonFuncInit<Singleton, Arguments extends any[]> = (
    ...args: Arguments
) => Singleton;

export default function createSingletonFunc<Singleton, Arguments extends any[]>(
    init: SingletonFuncInit<Singleton, Arguments>
): SingletonFuncInit<Singleton, Arguments> {
    let data = null;

    return (...args: Arguments) => {
        if (!data) {
            data = init(...args);
        }

        return data;
    };
}
