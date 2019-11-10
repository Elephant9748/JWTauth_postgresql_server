import { ApolloServer, PubSub } from "apollo-server-express";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import http from "http";

import "dotenv/config";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import ps from "./models";
import Dataloader from "dataloader";
import { batchBooks, batchPersons } from "./mydataloader";

import { getAuth } from "./authjwt";

const {
  APP_PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  NODE_ENV
} = process.env;
const IN_PROD = NODE_ENV === "production";

const startServer = async () => {
  try {
    await ps.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        // ps.sequelize.sync().then(() => console.log(" ==>  Sync models ... success !"));
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

    const app = express();

    //add redis store
    // let redisStore = connectRedis(session);

    // let client = new redis.createClient({
    //   host: REDIS_HOST,
    //   port: REDIS_PORT,
    //   password: REDIS_PASSWORD
    //   // db: REDIS_DB,
    // });

    // client.unref();
    // client.on("error", console.log);

    //adding session
    // const sessionMiddleware = session({
    //   store: new redisStore({ client }),
    //   name: SESS_NAME,
    //   secret: SESS_SECRET,
    //   resave: false,
    //   saveUninitialized: false,
    //   cookie: {
    //     maxAge: parseInt(SESS_LIFETIME),
    //     sameSites: true,
    //     secure: IN_PROD
    //   }
    // });
    // app.use(sessionMiddleware);

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
    // ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
    httpServer.listen({ port: APP_PORT }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${APP_PORT}${server.subscriptionsPath}`
      );
    });

    // app.listen({ port: APP_PORT }, () =>
    //   console.log(
    //     `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    //   )
    // );
  } catch (e) {
    console.error(e);
  }
};

startServer();
