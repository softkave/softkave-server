import {indexArray} from '../../../utilities/fns';

export function containsEveryItemIn<T2, T1 extends T2>(
  list1: T1[],
  list2: T2[],
  indexer: (item: T2) => string
) {
  const list1Map = indexArray(list1, {indexer});
  list2.forEach(item1 => {
    const k = indexer(item1);
    const item2 = list1Map[k];
    expect(item2).toBeTruthy();
  });
}

export function containsNoneIn<T2, T1 extends T2>(
  list1: T1[],
  list2: T2[],
  indexer: (item: T2) => string
) {
  const list1Map = indexArray(list1, {indexer});
  list2.forEach(item1 => {
    const k = indexer(item1);
    const item2 = list1Map[k];
    expect(item2).toBeFalsy();
  });
}

export function containsExactlyItemsIn<T2, T1 extends T2>(
  list1: T1[],
  list2: T2[],
  indexer: (item: T2) => string
) {
  expect(list1.length).toEqual(list2.length);
  containsEveryItemIn(list1, list2, indexer);
}
