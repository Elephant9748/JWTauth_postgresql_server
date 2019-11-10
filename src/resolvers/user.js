import bcrypt from "bcrypt";
import * as Auth from "../auth";
import { AuthenticationError } from "apollo-server-express";

import { createToken, refreshToken, sendRefreshToken, isAuth } from "../authjwt";
export default {
  Query: {
    Users: async (__, _args, { ps, req }) => {
      //auth
      // Auth.checkSignIn(req);
      return await ps.User.findAll();
    },
    me: async (__, _args, { ps, payload }) => {
      // Auth.checkSignIn(req);
      console.log(payload);
      isAuth(payload);
      return await ps.User.findOne({ where: { userId: payload.userId } });
    }
  },
  Mutation: {
    newUser: async (__, { name, password }, { ps, req }) => {
      //need to validate

      //authentication
      Auth.checkSignOut(req);

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
      // Auth.checkSignOut(req);

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
      sendRefreshToken(res, refreshToken(user.userId));

      return {
        accessToken: createToken(user.userId),
        user
      };
    },
    logOut: (__, _args, { req, res }) => {
      return req.session.userId ? Auth.logOut(req, res) : false;
    }
  }
};
