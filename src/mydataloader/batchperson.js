import operators from "sequelize";
import _ from "lodash";

//Dataloader Book
 const batchPersons = async (keys, { Person }) => {
    const persons = await Person.findAll({
      raw: true,
      where: {
        personId: {
          [operators.Op.in]: keys,
        },
      },
    });
    const gb = _.groupBy(persons, "personId");
    return keys.map(k => gb[k] || []);
  };
  // end function Dataloader

  export default batchPersons;