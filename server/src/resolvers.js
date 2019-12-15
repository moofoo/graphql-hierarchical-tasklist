const _ = require('lodash');
const shortid = require('shortid');
const { getAllDescendants } = require('../lib');

const initListId = shortid.generate();
const initRootId = shortid.generate();
const initTaskId = shortid.generate();

let taskLists = {
  [initListId]: {
    id: initListId,
    title: 'My Tasks',
    tasks: [
      {
        id: initRootId,
        parent: null,
        children: [initTaskId],
        root: true,
        depth: -1,
        text: '',
        complete: false
      },
      {
        id: initTaskId,
        parent: initRootId,
        children: [],
        root: false,
        depth: 0,
        text: '',
        complete: false
      }
    ]
  }
};

const resolvers = {
  Query: {
    taskLists: () => Object.values(taskLists),
    taskList: (root, { id }) => taskLists[id],
    tasks: (root, { taskList }) => taskLists[taskList].tasks
  },
  Mutation: {
    addTaskList(root, { title }) {
      const listId = shortid.generate();
      const rootId = shortid.generate();
      const taskId = shortid.generate();

      taskLists[listId] = {
        id: listId,
        title,
        tasks: [
          {
            id: rootId,
            parent: null,
            children: [taskId],
            root: true,
            depth: -1,
            text: '',
            complete: false
          },
          {
            id: taskId,
            parent: rootId,
            children: [],
            root: false,
            depth: 0,
            text: '',
            complete: false
          }
        ]
      };

      return taskLists[listId];
    },
    removeTaskList(root, { taskList }) {
      taskLists = _.omit(taskLists, [taskList]);

      return Object.values(taskLists);
    },
    addTask(root, { taskList, parent, after, text }) {
      const id = shortid.generate();

      if (parent === 'root') {
        parent = taskLists[taskList].tasks[0].id;
      }

      const parentDepth = _.find(taskLists[taskList].tasks, { id: parent })
        .depth;

      const newTask = {
        id,
        parent,
        children: [],
        root: false,
        depth: parentDepth + 1,
        text,
        complete: false
      };

      taskLists[taskList].tasks.push(newTask);

      const parentChildren = _.find(taskLists[taskList].tasks, { id: parent })
        .children;

      if (after === null) {
        parentChildren.push(id);
      } else {
        const afterIndex = _.findIndex(parentChildren, { id: after });
        parentChildren.splice(afterIndex + 1, 0, id);
      }

      return newTask;
    },
    removeTask(root, { taskList, task }) {
      const taskData = _.cloneDeep(
        _.find(taskLists[taskList].tasks, { id: task })
      );
      const parentId = taskData.parent;

      //Remove task from its parent's children
      const taskParentIndex = _.findIndex(taskLists[taskList].tasks, {
        id: parentId
      });

      taskLists[taskList].tasks[taskParentIndex].children = taskLists[
        taskList
      ].tasks[taskParentIndex].children.filter(childId => childId !== task);

      //Remove task from tasks array
      taskLists[taskList].tasks = taskLists[taskList].tasks.filter(
        tsk => tsk.id !== task
      );

      return taskData;
    },
    updateTask(root, { taskList, task, text }) {
      const taskIndex = _.findIndex(taskLists[taskList].tasks, { id: task });

      taskLists[taskList].tasks[taskIndex] = {
        ...taskLists[taskList].tasks[taskIndex],
        text
      };

      return taskLists[taskList].tasks[taskIndex];
    },
    moveAfter(root, { taskList, task, after }) {
      let afterParentId;
      if (after === 'root') {
        afterParentId = taskLists[taskList].tasks[0].id;
      } else {
        afterParentId = after
          ? _.find(taskLists[taskList].tasks, { id: after }).parent
          : taskLists[taskList].tasks[0].id;
      }

      const afterParentIndex = _.findIndex(taskLists[taskList].tasks, {
        id: afterParentId
      });

      console.log(afterParentId, afterParentIndex);

      // Add task as child of 'after' parent
      let parentChildren = taskLists[taskList].tasks[
        afterParentIndex
      ].children.filter(childId => childId !== task);

      const afterChildIndex = _.findIndex(
        taskLists[taskList].tasks[afterParentIndex].children,
        id => id === after
      );

      //  if (toTop) {
      //    parentChildren.unshift(task);
      //  } else {
      parentChildren.splice(afterChildIndex + 1, 0, task);
      //   }

      taskLists[taskList].tasks[afterParentIndex].children = _.uniq(
        parentChildren
      );
      const taskIndex = _.findIndex(taskLists[taskList].tasks, { id: task });

      if (after !== 'root') {
        //Remove task, if it exists, from 'after' task children, to handle
        //case when nested task is un-nested
        const afterIndex = _.findIndex(taskLists[taskList].tasks, {
          id: after
        });

        taskLists[taskList].tasks[afterIndex].children = _.uniq(
          taskLists[taskList].tasks[afterIndex].children.filter(
            childId => childId !== task
          )
        );

        //Update task with new parent and depth based on 'after'

        const oldDepth = taskLists[taskList].tasks[taskIndex].depth;
        const newDepth = _.find(taskLists[taskList].tasks, { id: after }).depth;
        const depthDiff = newDepth - oldDepth;

        taskLists[taskList].tasks[taskIndex] = {
          ...taskLists[taskList].tasks[taskIndex],
          depth: newDepth,
          parent: afterParentId
        };

        //Update descendants of task with new depth
        const descendants = getAllDescendants(taskLists[taskList].tasks, task);
        descendants.forEach((childId, index) => {
          const child = _.find(taskLists[taskList].tasks, { id: childId });
          child.depth = child.depth + depthDiff;
        });
      }

      return taskLists[taskList].tasks[taskIndex];
    },
    moveUnder(root, { taskList, task, under }) {
      const taskParentId = _.find(taskLists[taskList].tasks, { id: task })
        .parent;

      const taskParentIndex = _.findIndex(taskLists[taskList].tasks, {
        id: taskParentId
      });

      // Remove task from current parent's children
      let filteredChildren = taskLists[taskList].tasks[
        taskParentIndex
      ].children.filter(childId => childId !== task);

      taskLists[taskList].tasks[taskParentIndex].children = filteredChildren;

      //Add task as a child of 'under' unless last is specified
      const underIndex = _.findIndex(taskLists[taskList].tasks, { id: under });
      taskLists[taskList].tasks[underIndex].children.push(task);

      //Update task with new parent and depth based on 'under'
      const taskIndex = _.findIndex(taskLists[taskList].tasks, { id: task });

      const newDepth =
        _.find(taskLists[taskList].tasks, { id: under }).depth + 1;

      taskLists[taskList].tasks[taskIndex] = {
        ...taskLists[taskList].tasks[taskIndex],
        depth: newDepth,
        parent: under
      };

      //Update descendants of task with new depth
      const descendants = getAllDescendants(taskLists[taskList].tasks, task);
      descendants.forEach((childId, index) => {
        const child = _.find(taskLists[taskList].tasks, { id: childId });
        child.depth = child.depth + 1;
      });

      return taskLists[taskList].tasks[taskIndex];
    },
    setComplete(root, { taskList, task, complete }) {
      const theTask = _.find(taskLists[taskList].tasks, { id: task });

      theTask.complete = complete;

      if (complete) {
        const descendants = getAllDescendants(taskLists[taskList].tasks, task);
        descendants.forEach((childId, index) => {
          const child = _.find(taskLists[taskList].tasks, { id: childId });
          child.complete = complete;
        });
      }

      return theTask;
    },
    clearCompleted(root, { taskList }) {
      const completed = [];

      taskLists[taskList].tasks = taskLists[taskList].tasks.filter(task => {
        if (task.complete) {
          completed.push(task.id);
        }
        return !task.complete;
      });

      taskLists[taskList].tasks.forEach(task => {
        task.children = task.children.filter(childId => {
          return !completed.includes(childId);
        });
      });

      return taskLists[taskList];
    }
  }
};

module.exports = resolvers;
