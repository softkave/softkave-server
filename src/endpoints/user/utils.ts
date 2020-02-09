export function addEntryToPasswordDateLog(arr: number[]) {
  arr.push(Date.now());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}
