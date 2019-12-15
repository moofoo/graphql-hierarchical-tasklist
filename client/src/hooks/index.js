import { useContext } from 'react';
import { useQuery } from 'react-apollo';
import { QUERY_TASKS } from '../graphql/queries';
import { flattenTasks } from '../lib';

import { Context } from '../context';

export const useTasks = () => {
  const {
    state: { selectedId }
  } = useContext(Context);

  const { loading, data } = useQuery(QUERY_TASKS, {
    variables: {
      taskList: selectedId
    }
  });

  if (loading) {
    return [];
  }

  return flattenTasks(data.tasks);
};
