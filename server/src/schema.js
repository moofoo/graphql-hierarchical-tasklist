const { gql } = require('apollo-server');

const typeDefs = gql`
  type Task {
    id: ID!
    text: String
    parent: ID
    children: [ID]
    depth: Int
    root: Boolean
    complete: Boolean
  }

  type TaskList {
    id: ID!
    title: String
    tasks: [Task]
  }

  type Query {
    taskLists: [TaskList]
    taskList(id: ID!): TaskList
    tasks(taskList: ID!): [Task]
  }

  type Mutation {
    addTaskList(title: String): TaskList
    removeTaskList(taskList: ID!): [TaskList]
    addTask(taskList: ID!, parent: ID!, after: ID, text: String!): Task
    removeTask(taskList: ID!, task: ID!): Task
    updateTask(taskList: ID!, task: ID!, text: String): Task
    moveAfter(taskList: ID!, task: ID!, after: ID): Task
    moveBefore(taskList: ID!, task: ID!, before: ID): Task
    indent(taskList: ID!, task: ID!, under: ID!): Task
    unindent(taskList: ID!, task: ID!, under: ID!): Task
    setComplete(taskList: ID!, task: ID, complete: Boolean!): Task
    clearCompleted(taskList: ID!): TaskList
  }
`;

module.exports = typeDefs;
