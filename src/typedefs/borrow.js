import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        Borrows: [Borrow!]!
        selectPerson(personIds: ID!):[Borrow!]!
    }

    extend type Mutation {
        startBorrow(borrowIds: ID!, personIds: ID!, bookIds: ID!, takendate: String!, broughtdate: String!):Borrow
    }

    extend type Subscription {
        borrowAdded: Borrow
    }

    type Borrow {
        borrowId: ID!
        persons: [Person!]!
        books: [Book!]!
        takendate: String!
        broughtdate: String!
        createdAt: String!
        updatedAt: String!
    }
`
