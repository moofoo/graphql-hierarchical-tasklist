import React, { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { useTasks } from '../hooks';
import { MOVE_AFTER } from '../graphql/mutations';
import Tasks from './Tasks';
import { Context } from '../context';

const TasksContainer = () => {
  const tasks = useTasks();

  const {
    state: { selectedId },
    setDraggedTask,
    setHiddenTasks
  } = useContext(Context);

  const [moveAfter] = useMutation(MOVE_AFTER, {
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

    const draggedTask = tasks[oldIndex];
    let droppedTask = tasks[newIndex].left;
    const draggedId = draggedTask.id;
    let droppedId = droppedTask && droppedTask.id;

    if (droppedTask.parent === draggedId) {
      return;
    }

    if (!droppedTask) {
      moveAfter({
        variables: {
          taskList: selectedId,
          task: draggedId,
          after: 'root'
        }
      });
    } else {
      moveAfter({
        variables: {
          taskList: selectedId,
          task: draggedId,
          after: droppedId
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
