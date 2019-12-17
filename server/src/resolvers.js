const _ = require('lodash');
const shortid = require('shortid');
const { getAllDescendants } = require('./lib');
const { moveAfter, moveBefore, indent, unindent } = require('./hieararchical');

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
      moveAfter(taskLists[taskList].tasks, task, after);
    },

    moveBefore(root, { taskList, task, before }) {
      moveBefore(taskLists[taskList].tasks, task, before);
    },

    indent(root, { taskList, task, under }) {
      indent(taskLists[taskList].tasks, task, under);
    },

    unindent(root, { taskList, task, under }) {
      unindent(taskLists[taskList].tasks, task, under);
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
