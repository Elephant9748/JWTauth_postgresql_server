import { AuthenticationError } from "apollo-server-express";

const { SESS_NAME }  = process.env;

const checkUserId = req => req.session.userId;

export const checkSignIn = req => {
  if (!checkUserId(req)) {
    throw new AuthenticationError("Not authenticated !");
  }
};

export const checkSignOut = req => {
  if (checkUserId(req)) {
    throw new AuthenticationError("You are already authenticated !");
  }
};

export const logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      res.clearCookie(SESS_NAME);
      resolve(true);
    });
  });
