// backend/schema.js
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    assignee: User
    createdBy: User
  }

  type Notification {
    id: ID!
    message: String!
    read: Boolean!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    tasks: [Task!]!
    notifications: [Notification!]!
    allUsers: [User!]!  # matches resolvers.js
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createTask(title: String!, description: String!, assigneeId: ID!): Task
    updateTaskStatus(taskId: ID!, status: String!): Task
    markNotificationRead(notificationId: ID!): Notification
    deleteUser(userId: ID!): Boolean # matches resolvers.js
  }
`;

module.exports = typeDefs;
