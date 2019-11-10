export default (sequelize, DataType) => {
    const Person = sequelize.define(
      "persons",
      {
        personId: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
          allowNull: false
        },
        name: {
          type: DataType.STRING
        },
        address: {
          type: DataType.STRING
        },
        phone: {
            type: DataType.STRING
        },
      },
      {
        timestamps: true
      }
    );
      
    Person.associate = (ps) => {
        Person.hasMany(ps.Borrow, {
            foreignKey: 'bookId'
        });
    }

    return Person;
  };
  