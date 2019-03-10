function addEntryToPasswordDateLog(arr) {
  arr.push(Date.now());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

module.exports = {
  addEntryToPasswordDateLog
};