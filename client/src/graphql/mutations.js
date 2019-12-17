import { gql } from 'apollo-boost';

export const ADD_TASK_LIST = gql`
  mutation AddTaskList($title: String) {
    addTaskList(title: $title) {
      id
      title
      tasks {
        id
        parent
        children
        root
        text
        complete
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($taskList: ID!, $parent: ID!, $after: ID, $text: String!) {
    addTask(taskList: $taskList, parent: $parent, after: $after, text: $text) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($taskList: ID!, $task: ID!, $text: String!) {
    updateTask(taskList: $taskList, task: $task, text: $text) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const REMOVE_TASK = gql`
  mutation RemoveTask($taskList: ID!, $task: ID!) {
    removeTask(taskList: $taskList, task: $task) {
      id
      text
      parent
      children
      root
    }
  }
`;

export const INDENT = gql`
  mutation Indent($taskList: ID!, $task: ID!, $under: ID!) {
    indent(taskList: $taskList, task: $task, under: $under) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const UNINDENT = gql`
  mutation Unindent($taskList: ID!, $task: ID!, $under: ID!) {
    unindent(taskList: $taskList, task: $task, under: $under) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const MOVE_AFTER = gql`
  mutation MoveAfter($taskList: ID!, $task: ID!, $after: ID) {
    moveAfter(taskList: $taskList, task: $task, after: $after) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const MOVE_BEFORE = gql`
  mutation MoveBefore($taskList: ID!, $task: ID!, $before: ID) {
    moveBefore(taskList: $taskList, task: $task, before: $before) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const SET_COMPLETE = gql`
  mutation SetComplete($taskList: ID!, $task: ID!, $complete: Boolean!) {
    setComplete(taskList: $taskList, task: $task, complete: $complete) {
      id
      parent
      children
      root
      text
      complete
    }
  }
`;

export const CLEAR_COMPLETE = gql`
  mutation ClearCompleted($taskList: ID!) {
    clearCompleted(taskList: $taskList) {
      id
      title
      tasks {
        id
        text
        parent
        children
        root
        complete
      }
    }
  }
`;
