import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        Persons: [Person!]!
        Person(personId: ID!):Person
    }

    extend type Mutation {
        addPerson(name: String!, address: String!, phone: String!):Person
        updatePerson(personId: ID!, name: String!, address: String!, phone: String!):Person
        deletePerson(personId: ID!):Boolean
    }

    type Person {
        personId: ID!
        name: String!
        address: String!
        phone: String!
        createdAt: String!
        updatedAt: String!
    }
`