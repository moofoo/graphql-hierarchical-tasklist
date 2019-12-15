import React, { useContext } from 'react';
import _ from 'lodash';
import { SortableContainer } from 'react-sortable-hoc';
import { Context } from '../context';
import Task from './Task';

const renderTasks = (tasks, exclude = []) => {
  return tasks.map((task, index) => {
    if (exclude.includes(task.id)) {
      return null;
    }
    return <Task key={task.id} task={task} index={index} />;
  });
};

const Tasks = ({ tasks }) => {
  const {
    state: { hiddenTasks }
  } = useContext(Context);

  return <div>{renderTasks(tasks, hiddenTasks)}</div>;
};

export default SortableContainer(Tasks);
