import Sequelize from "sequelize";

const seq = new Sequelize(
  "postgres://ihivgppk:ksSTLbCKftrLmg08sqk6rwNt8nZdoHQR@salt.db.elephantsql.com:5432/ihivgppk"
);

const ps = {
  Book: seq.import("./book"),
  Borrow: seq.import("./borrow"),
  Person: seq.import("./person"),
  User: seq.import("./user")
};

Object.keys(ps).forEach(modelName => {
  if ("associate" in ps[modelName]) {
    ps[modelName].associate(ps);
  }
});

ps.sequelize = seq;

export default ps;
