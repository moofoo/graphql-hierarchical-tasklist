import React, { useContext } from 'react';
import _ from 'lodash';
import { SortableContainer } from 'react-sortable-hoc';
import { Context } from '../context';
import Task from './Task';

const renderTasks = tasks => {
  return tasks.map((task, index) => {
    return <Task key={task.id} task={task} index={index} />;
  });
};

const Tasks = ({ tasks }) => {
  const {
    state: { hiddenTasks }
  } = useContext(Context);

  const tasksMod = tasks.filter(task => {
    return !hiddenTasks.includes(task.id);
  });

  return <div>{renderTasks(tasksMod)}</div>;
};

export default SortableContainer(Tasks);
