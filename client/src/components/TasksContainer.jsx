import React, { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { useTasks } from '../hooks';
import { MOVE_AFTER, MOVE_BEFORE } from '../graphql/mutations';
import Tasks from './Tasks';
import { Context } from '../context';

const TasksContainer = () => {
  const tasks = useTasks();

  const {
    state: { selectedId },
    setHiddenTasks
  } = useContext(Context);

  const [moveAfter] = useMutation(MOVE_AFTER, {
    refetchQueries: ['Tasks']
  });

  const [moveBefore] = useMutation(MOVE_BEFORE, {
    refetchQueries: ['Tasks']
  });

  const updateBeforeSortStart = ({ index }) => {
    setHiddenTasks(tasks[index].descendants);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setHiddenTasks([]);

    if (oldIndex === newIndex) {
      return;
    }

    if (newIndex > oldIndex) {
      moveAfter({
        variables: {
          taskList: selectedId,
          task: tasks[oldIndex].id,
          after: tasks[newIndex].id
        }
      });
    } else {
      moveBefore({
        variables: {
          taskList: selectedId,
          task: tasks[oldIndex].id,
          before: tasks[newIndex].id
        }
      });
    }
  };

  return (
    <Tasks
      tasks={tasks}
      useDragHandle
      lockAxis='y'
      updateBeforeSortStart={updateBeforeSortStart}
      onSortEnd={onSortEnd}
    />
  );
};

export default TasksContainer;
