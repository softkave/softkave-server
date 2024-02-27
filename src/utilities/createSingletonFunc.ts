import assert = require('assert');

export type SingletonFnInit<Singleton, Arguments extends any[]> = (...args: Arguments) => Singleton;

export default function makeSingletonFn<Singleton, Arguments extends any[]>(
  init: SingletonFnInit<Singleton, Arguments>
): SingletonFnInit<Singleton, Arguments> {
  let data: Singleton | null = null;
  return (...args: Arguments) => {
    if (!data) {
      data = init(...args);
    }

    assert(data);
    return data;
  };
}
