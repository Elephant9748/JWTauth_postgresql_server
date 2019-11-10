import * as Auth from "../auth";
const BORROW_ADDED = 'BORROW_ADDED';

export default {
  Query: {
    Borrows: async (__, _args, { ps, req }, _info) => {
      //authentivation
      Auth.checkSignIn(req);

      //return data
      return await ps.Borrow.findAll();
    },
    selectPerson: async (__, args, { ps }) => {
      Auth.checkSignIn(req);
      return await ps.Borrow.findAll({ where: { personId: args.personIds } });
    }
  },
  Mutation: {
    startBorrow: async (__, args, { ps, pubsub, req }, _info) => {

      //!need validation

      //authentication
      Auth.checkSignIn(req);
      //adding borrow
      const borrow =  await ps.Borrow.create({
        borrowId: parseInt(args.borrowIds),
        personId: args.personIds,
        bookId: args.bookIds,
        takendate: args.takendate,
        broughtdate: args.broughtdate
      });

      pubsub.publish(BORROW_ADDED, { borrowAdded: borrow });
      return borrow;
    }
  },
  Borrow: {
    persons: async ({ personId }, __, { personLoader }) => {
      return await personLoader.load(personId);
      // return await ps.Person.findAll({ where: { personId: personId } });
    },
    books: async ({ bookId }, __, { bookLoader }) => {
      return await bookLoader.load(bookId);
      // return await ps.Book.findAll({ where: { bookId: bookId } });
    }
  },
  Subscription: {
    borrowAdded: {
      subscribe: (__, _args, { pubsub, connection }) => {

        // ! need more to know subcription client (token access WS)

        // console.log(connection.context.req.session);
        if (!connection.context.req.session.userId) {
          throw new Error("Not authed !");
        }
        return pubsub.asyncIterator([BORROW_ADDED]);
      }
    }
  }
};
