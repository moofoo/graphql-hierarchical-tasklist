import { gql } from 'apollo-boost';

export const QUERY_TASKLISTS = gql`
  query TaskLists {
    taskLists {
      id
      title
    }
  }
`;

export const QUERY_TASKS = gql`
  query Tasks($taskList: ID!) {
    tasks(taskList: $taskList) {
      id
      text
      children
      parent
      root
      depth
      complete
    }
  }
`;
