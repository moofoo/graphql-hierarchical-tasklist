import React, { useContext } from 'react';
import { useMutation } from 'react-apollo';
import { InputGroup, FormControl } from 'react-bootstrap';
import { SortableElement, sortableHandle } from 'react-sortable-hoc';
import { MdDragHandle } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import {
  UPDATE_TASK,
  SET_COMPLETE,
  REMOVE_TASK,
  INDENT,
  UNINDENT
} from '../graphql/mutations';
import { Context } from '../context';

const DraggableHandle = sortableHandle(() => (
  <MdDragHandle style={{ marginTop: 10, marginRight: 5, cursor: 'move' }} />
));

const Task = ({ task }) => {
  const {
    state: { selectedId }
  } = useContext(Context);

  const [updateTask] = useMutation(UPDATE_TASK);

  const [indent] = useMutation(INDENT, {
    refetchQueries: ['Tasks']
  });

  const [unindent] = useMutation(UNINDENT, {
    refetchQueries: ['Tasks']
  });

  const [setComplete] = useMutation(SET_COMPLETE, {
    refetchQueries: ['Tasks']
  });

  const [removeTask] = useMutation(REMOVE_TASK, {
    refetchQueries: ['Tasks']
  });

  const keyDownHandler = event => {
    if (event.key === 'Tab' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
    }

    if (event.key === 'Tab' && !event.shiftKey && task.left) {
      if (task.leftByDepth && task.depth <= task.left.depth) {
        indent({
          variables: {
            taskList: selectedId,
            task: task.id,
            under: task.leftByDepth.id
          }
        });
      } else if (task.depth <= task.left.depth) {
        indent({
          variables: {
            taskList: selectedId,
            task: task.id,
            under: task.left.id
          }
        });
      }
    } else if (
      event.key === 'Tab' &&
      event.shiftKey &&
      task.left &&
      task.depth > 0
    ) {
      if (task.depth <= task.left.depth) {
        unindent({
          variables: {
            taskList: selectedId,
            task: task.id,
            under: (task.leftParent && task.leftParent.id) || task.left.id
          }
        });
      } else {
        unindent({
          variables: {
            taskList: selectedId,
            task: task.id,
            under: task.left.id
          }
        });
      }
    }
  };

  return (
    <InputGroup className='mb-3'>
      <DraggableHandle />
      <InputGroup.Prepend style={{ marginLeft: task.depth * 15 }}>
        <InputGroup.Checkbox
          aria-label='Complete'
          checked={task.complete}
          onChange={e =>
            setComplete({
              variables: {
                taskList: selectedId,
                task: task.id,
                complete: e.target.checked
              }
            })
          }
        />
      </InputGroup.Prepend>
      <FormControl
        value={task.text}
        onKeyDown={keyDownHandler}
        onChange={e =>
          updateTask({
            variables: {
              taskList: selectedId,
              task: task.id,
              text: e.target.value
            }
          })
        }
      />
      <InputGroup.Append>
        <InputGroup.Text id='basic-addon2'>
          <FaTrash
            style={{ cursor: 'pointer' }}
            onClick={() =>
              removeTask({ variables: { taskList: selectedId, task: task.id } })
            }
          />
        </InputGroup.Text>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default SortableElement(Task);
