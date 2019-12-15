import _ from 'lodash';

const getAllDescendantIds = (tasks, id) =>
  _.find(tasks, { id }).children.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(tasks, childId)],
    []
  );

const _flattenTasks = (children, tasks, result = []) => {
  _.forEach(children, id => {
    result.push(id);

    if (_.find(tasks, { id }).children.length) {
      result = _flattenTasks(_.find(tasks, { id }).children, tasks, result);
    }
  });

  return result;
};

export const flattenTasks = tasks => {
  const root = _.find(tasks, { root: true });

  if (root.children.length === 0) {
    return [];
  }

  const tmp = _flattenTasks(root.children, tasks);

  const result = [];

  _.uniq(tmp).forEach((taskId, index) => {
    const task = _.find(tasks, { id: taskId });
    result.push({
      ...task,
      descendants: getAllDescendantIds(tasks, taskId),
      left: _.find(tasks, { id: tmp[index - 1] })
    });
  });

  result.forEach((task, index) => {
    const depth = task.depth;

    if (index <= 1) {
      task.leftByDepth = undefined;
    } else {
      for (let x = index - 1; x >= 0; x--) {
        if (result[x].depth === depth) {
          task.leftByDepth = result[x];
          task.leftParent = _.find(tasks, { id: task.leftByDepth.parent });
          break;
        }
      }
    }
  });

  console.log('falttened tasks', result);

  return result;
};
