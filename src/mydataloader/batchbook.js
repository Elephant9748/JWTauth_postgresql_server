import operators from "sequelize";
import _ from "lodash";

//Dataloader Book
 const batchBooks = async (keys, { Book }) => {
    const book = await Book.findAll({
      raw: true,
      where: {
        bookId: {
          [operators.Op.in]: keys,
        },
      },
    });
    const gb = _.groupBy(book, "bookId");
    return keys.map(k => gb[k] || []);
  };
  // end function Dataloader

  export default batchBooks;