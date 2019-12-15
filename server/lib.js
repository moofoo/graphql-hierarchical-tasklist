const _ = require('lodash');

const getAllDescendantIds = (tasks, id) =>
  _.find(tasks, { id }).children.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(tasks, childId)],
    []
  );

exports.getAllDescendants = getAllDescendantIds;
