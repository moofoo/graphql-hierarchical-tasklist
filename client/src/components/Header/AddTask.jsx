import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation } from 'react-apollo';
import { ADD_TASK } from '../../graphql/mutations';
import { Context } from '../../context';

const AddTask = () => {
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: ['Tasks']
  });

  const {
    state: { selectedId }
  } = useContext(Context);

  return (
    <Button
      style={{ marginRight: 10 }}
      variant='primary'
      onClick={() =>
        addTask({
          variables: {
            taskList: selectedId,
            parent: 'root',
            after: null,
            text: ''
          }
        })
      }
    >
      Add Task
    </Button>
  );
};

export default AddTask;
