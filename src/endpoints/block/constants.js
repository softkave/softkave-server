module.exports = exports;

exports.minNameLength = 0;
exports.maxNameLength = 300;
exports.minDescriptionLength = 0;
exports.maxDescriptionLength = 1000;
exports.maxParentsLength = 10;
exports.minRequiredStringLength = 1;
exports.minTaskCollaboratorsLength = 0;
exports.maxTaskCollaboratorsLength = 10;
exports.minAddCollaboratorBodyMessageLength = 0;
exports.maxAddCollaboratorBodyMessageLength = 500;
exports.minAddCollaboratorValuesLength = 0;
exports.maxAddCollaboratorValuesLength = 10;
exports.maxChildrenCount = 100;

exports.blockTypes = ["group", "org", "project", "task", "root", "info-card"];
exports.priorityValues = ["not important", "important", "very important"];
exports.groupContexts = ["groupTaskContext", "groupProjectContext"];
