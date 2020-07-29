export type SingletonFuncInit<T, A extends any[]> = (...args: A) => T;

export default function createSingletonFunc<T, A extends any[]>(
  init: SingletonFuncInit<T, A>
): SingletonFuncInit<T, A> {
  let data = null;

  return (...args: A) => {
    if (!data) {
      data = init(...args);
    }

    return data;
  };
}
