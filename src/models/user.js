export default (sequelize, DataType) => {
    const User = sequelize.define(
      "users",
      {
        userId: {
          type: DataType.UUID,
          primaryKey: true,
          defaultValue: DataType.UUIDV4,
          allowNull: false
        },
        name: {
          type: DataType.STRING
        },
        password: {
          type: DataType.STRING
        }
      },
      {
        timestamps: true
      }
    );

    return User;
  };
  