import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation } from 'react-apollo';
import { CLEAR_COMPLETE } from '../../graphql/mutations';
import { Context } from '../../context';

const AddTask = () => {
  const [clearComplete] = useMutation(CLEAR_COMPLETE, {
    refetchQueries: ['Tasks']
  });

  const {
    state: { selectedId }
  } = useContext(Context);

  return (
    <Button
      variant='primary'
      onClick={() =>
        clearComplete({
          variables: {
            taskList: selectedId
          }
        })
      }
    >
      Clear Complete
    </Button>
  );
};

export default AddTask;
