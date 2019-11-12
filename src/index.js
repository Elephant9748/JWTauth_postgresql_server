import { ApolloServer, PubSub } from "apollo-server-express";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

import "dotenv/config";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import ps from "./models";
import Dataloader from "dataloader";
import { batchBooks, batchPersons } from "./mydataloader";

import { getAuth, createToken } from "./authjwt";
import { verify } from "jsonwebtoken";

const { PORT, NODE_ENV, REFRESH_TOKEN_SECRET } = process.env;
const IN_PROD = NODE_ENV === "production";

const startServer = async () => {
  try {
    await ps.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        // sync table and schema
        // await ps.sequelize.sync().then(() => console.log(" ==>  Sync models ... success !"));
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

    const app = express();
    app.use(cookieParser());
    app.post("/refresh_token", async (req, res) => {
      //get token
      const token = req.cookies.jid;
      if (!token) {
        return res.send({
          rToken: false,
          accessToken: "",
          msg: "Not getting token !"
        });
      }

      //varify jwt
      let payload;
      try {
        payload = verify(token, REFRESH_TOKEN_SECRET);
      } catch ({ message }) {
        console.log(message);
        return res.send({
          rToken: false,
          accessToken: "",
          msg: message || ""
        });
      }

      //find user on db
      const user = await ps.User.findOne({ where: { userId: payload.userId } });
      if (!user) {
        return res.send({
          rToken: false,
          accessToken: "",
          err: "payload not found !"
        });
      }

      //revoke access token !need more dev for this
      if (user.tokenversion !== payload.tokenversion) {
        return res.send({
          rToken: false,
          accessToken: "",
          msg: "revokeAllToken"
        });
      }

      //here can create refresh token (refresh expired)
      // --

      //send the access token
      return res.send({
        rToken: true,
        accessToken: createToken(user),
        msg: ""
      });
    });

    //addind Subscriptions
    const pubsub = new PubSub();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: IN_PROD
        ? false
        : {
            settings: {
              "request.credentials": "include"
            }
          },
      context: ({ req, res, connection }) => ({
        req,
        res,
        connection,
        ps,
        pubsub,
        bookLoader: new Dataloader(keys => batchBooks(keys, ps)),
        personLoader: new Dataloader(keys => batchPersons(keys, ps)),
        payload: getAuth(req)
      }),
      subscriptions: {
        onConnect: (_, ws) => {
          return new Promise(res =>
            sessionMiddleware(ws.upgradeReq, {}, () => {
              res({ req: ws.upgradeReq });
            })
          );
        }
      }
    });

    server.applyMiddleware({ app });

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen({ port: PORT || 4000 }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      );
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();
