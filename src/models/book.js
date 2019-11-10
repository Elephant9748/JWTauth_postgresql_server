export default (sequelize, DataType) => {
  const Book = sequelize.define(
    "books",
    {
      bookId: {
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false
      },
      title: {
        type: DataType.STRING
      },
      author: {
        type: DataType.STRING
      }
    },
    {
      timestamps: true
    }
  );

  Book.associate = ps => {
    Book.hasMany(ps.Borrow, {
      foreignKey: "bookId"
    });
  };

  return Book;
};
