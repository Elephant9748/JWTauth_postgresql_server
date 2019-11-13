import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    me: User
    Users: [User!]!
  }

  extend type Mutation {
    newUser(name: String!, password: String!):User
    logIn(name: String!, password: String!):loginResponse
    revokeTokenForUser(userId: ID!): Boolean
    logout:Boolean
  }

  type User {
    userId: ID!
    name: String!
    password: String!
    tokenversion: Int
    createdAt: String!
    updatedAt: String!
  }

  type loginResponse {
    accessToken: String!
    user: User!
  }
`