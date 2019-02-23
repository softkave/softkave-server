const blockTypes = ["org", "project", "group", "task", "root", "info-card"];
const blockHierachy = {
  root: 0,
  org: 0,
  group: -1,
  project: 1,
  task: 2,
  "info-card": 2
};

module.exports = {
  blockTypes
};
