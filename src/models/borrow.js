export default (sequelize, DataType) => {
  const Borrow = sequelize.define(
    "borrows",
    {
      borrowId: {
        type: DataType.INTEGER
      },
      takendate: {
        type: DataType.STRING
      },
      broughtdate: {
        type: DataType.STRING
      }
    }
  );

  Borrow.associate = ps => {
    Borrow.belongsTo(ps.Book, {
      foreignKey: "bookId"
    });
    Borrow.belongsTo(ps.Person, {
      foreignKey: "personId"
    });
  };

  return Borrow;
};
