export default {
  Query: {
    Persons: async (__, _args, { ps }, _info) => {
      return await ps.Person.findAll();
    },
    Person: async (__, { personId }, { ps }, _info) => {
      return await ps.Person.findOne({ where: { personId: personId } });
    }
  },
  Mutation: {
    addPerson: async (__, args, { ps }) => {

      //!need validation

      return await ps.Person.findOrCreate({
        where: { name: args.name },
        defaults: { address: args.address, phone: args.phone }
      }).then(([person, created]) => {
        console.log(
          person.get({
            plain: true
          })
        );
        console.log("created = ", created);
        return person.get();
      });
    },
    updatePerson: async (__, args, { ps }) => {
      await ps.Person.update(
        {
          name: args.name,
          address: args.address,
          phone: args.phone
        },
        { where: { personId: args.personId } }
      )
      return ps.Person.findOne({ where: { personId: args.personId } });
             
    },
    deletePerson: async (__, { personId }, { ps }) => {
      return await ps.Person.destroy({ where: { personId: personId } }).then(project =>
        project === 1 ? true : false
      );
    }
  }
};
