import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    Book(bookId: ID!): Book!
    Books: [Book!]!
  }

  extend type Mutation {
    addBook(title: String!, author: String!):Book
    updateBook(bookId: ID!, title: String!, author: String!):Book
    deleteBook(bookId: ID!):Boolean
  }

  type Book {
    bookId: ID!
    title: String!
    author: String!
    datepublish: String!
    createdAt: String!
    updatedAt: String!
  }
`