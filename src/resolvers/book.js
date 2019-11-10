export default {
  Query: {
    Books: async (__, _args, { ps }, _info) => {
      return await ps.Book.findAll();
    },
    Book: async (__, { bookId }, { ps }, _info) => {
      return await ps.Book.findOne({ where: { bookId: bookId } });
    }
  },
  Mutation: {
    addBook: async (__, args, { ps }) => {

      //!need validation

      return await ps.Book.findOrCreate({
        where: { author: args.author },
        defaults: { title: args.title }
      }).then(async ([book, created]) => {
        console.log(
          book.get({
            plain: true
          })
        );
        console.log("created = ", created);
        return await book.get();
      });
    },
    updateBook: async (__, args, { ps }) => {
      await ps.Book.update(
        {
          title: args.title,
          author: args.author
        },
        { where: { bookId: args.bookId } }
      )
      
      return ps.Book.findOne({ where: { bookId: args.bookId } });
    },
    deleteBook: async (__, { bookId }, { ps }) => {
      return await ps.Book.destroy({ where: { bookId: bookId } }).then(project =>
        project === 1 ? true : false
      );
    }
  }
};
