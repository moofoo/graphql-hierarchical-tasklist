const { find, findIndex, uniq } = require('lodash');

const getAllDescendantIds = (tasks, id) =>
  find(tasks, { id }).children.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(tasks, childId)],
    []
  );

const moveTo = (tasks, taskId, siblingId, where = 'after') => {
  let task = find(tasks, { id: taskId });
  const taskIndex = findIndex(tasks, { id: taskId });
  const taskDepth = task.depth;
  const taskParent = find(tasks, { id: task.parent });
  const taskParentIndex = findIndex(tasks, { id: task.parent });

  const sibling = find(tasks, { id: siblingId });
  const siblingIndex = findIndex(tasks, { id: siblingId });
  const siblingDepth = sibling.depth;
  const siblingParent = find(tasks, { id: sibling.parent });
  const siblingChildIndex = findIndex(
    siblingParent.children,
    childId => childId == siblingId
  );

  //remove task from current parent children;

  tasks[taskParentIndex].children = tasks[taskParentIndex].children.filter(
    childId => childId !== taskId
  );

  //Add task to children of after parent
  if (taskDepth !== siblingDepth) {
    if (where === 'before') {
      siblingParent.children.splice(siblingChildIndex, 0, taskId);
    } else {
      siblingParent.children.splice(siblingChildIndex + 1, 0, taskId);
    }
  } else {
    siblingParent.children.splice(siblingChildIndex, 0, taskId);
  }

  //Update parent and depth of moved task

  tasks[taskIndex] = {
    ...task,
    parent: sibling.parent,
    depth: sibling.depth
  };

  //update depth of task descendants
  const depthDiff = siblingDepth - taskDepth;
  const descendants = getAllDescendantIds(tasks, taskId);

  descendants.forEach((childId, index) => {
    const child = find(tasks, { id: childId });
    let childDepth = child.depth + depthDiff;
    if (childDepth < 0) {
      childDepth = 0;
    }
    child.depth = childDepth;
  });
};

const moveAfter = (tasks, taskId, afterId) => {
  moveTo(tasks, taskId, afterId, 'after');
};

const moveBefore = (tasks, taskId, beforeId) => {
  moveTo(tasks, taskId, beforeId, 'before');
};

const indent = (tasks, taskId, underId) => {
  const taskParentId = find(tasks, { id: taskId }).parent;

  const taskParentIndex = findIndex(tasks, {
    id: taskParentId
  });

  // Remove task from current parent's children
  let filteredChildren = tasks[taskParentIndex].children.filter(
    childId => childId !== taskId
  );

  tasks[taskParentIndex].children = filteredChildren;

  //Add task as a child of 'under' unless last is specified
  const underIndex = findIndex(tasks, { id: underId });
  tasks[underIndex].children.push(taskId);

  //Update task with new parent and depth based on 'under'
  const taskIndex = findIndex(tasks, { id: taskId });

  let newDepth = find(tasks, { id: underId }).depth + 1;

  if (newDepth < 0) {
    newDepth = 0;
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    depth: newDepth,
    parent: underId
  };

  //Update descendants of task with new depth
  const descendants = getAllDescendantIds(tasks, taskId);

  descendants.forEach((childId, index) => {
    const child = find(tasks, { id: childId });
    child.depth = child.depth + 1;
  });
};

const unindent = (tasks, taskId, underId) => {
  moveAfter(tasks, taskId, underId);
};

module.exports = {
  moveAfter,
  moveBefore,
  indent,
  unindent
};
