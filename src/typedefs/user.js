import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    me: User
    Users: [User!]!
  }

  extend type Mutation {
    newUser(name: String!, password: String!):User
    logIn(name: String!, password: String!):loginResponse
    logOut: String!
  }

  type User {
    userId: ID!
    name: String!
    password: String!
    createdAt: String!
    updatedAt: String!
  }

  type loginResponse {
    accessToken: String!
    user: User!
  }
`