import bcrypt from "bcrypt";
import { AuthenticationError } from "apollo-server-express";

import {
  createToken,
  refreshToken,
  sendRefreshToken,
  isAuth
} from "../authjwt";
export default {
  Query: {
    Users: async (__, _args, { ps, req }) => {
      //auth

      return await ps.User.findAll();
    },
    me: async (__, _args, { ps, payload }) => {
      
      console.log(payload);
      isAuth(payload);
      return await ps.User.findOne({ where: { userId: payload.userId } });
    }
  },
  Mutation: {
    newUser: async (__, { name, password }, { ps }) => {
      //need to validate

      const hashPass = await bcrypt.hash(password, 10);

      const user = await ps.User.findOrCreate({
        where: { name: name },
        defaults: { password: hashPass }
      }).then(([user, created]) => {
        console.log(
          user.get({
            plain: true
          })
        );
        console.log("created = ", created);
        return user.get();
      });

      return user;
    },
    logIn: async (__, { name, password }, { ps, res }) => {

      const user = await ps.User.findOne({ where: { name: name } });
      const mssg = "name or password incorrect !";
      if (!user) {
        throw new AuthenticationError(mssg);
      }

      const checkpass = await bcrypt.compare(password, user.password);
      if (!checkpass) {
        throw new AuthenticationError(mssg);
      }

      //success
      // send refresh token to cookies
      sendRefreshToken(res, refreshToken(user));

      return {
        accessToken: createToken(user),
        user
      };
    },
    revokeTokenForUser: async (__, args, { ps }) => {
      const id = args.userId;
      const revoke = await ps.User
        .findOne({ where: { userId: id } })
        .then(user => user.increment("tokenversion", { by: 1 }))
        .then(user => {
          const reload = user.reload();
          if (!reload) {
            return false;
          }
          return true;
        });
      return revoke;
    }
  }
};
