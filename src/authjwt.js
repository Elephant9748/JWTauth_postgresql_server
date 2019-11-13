import { AuthenticationError } from "apollo-server-express";
import { sign, verify } from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const createToken = payload => {
  return sign(
    { userId: payload.userId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15s"
    }
  );
};

export const refreshToken = payload => {
  return sign(
    { userId: payload.userId, tokenversion: payload.tokenversion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3d"
    }
  );
};

export const sendRefreshToken = (res, token) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token"
  });
};

export const isAuth = payload => {
  console.log(payload);
  if (!payload) {
    throw new AuthenticationError("Not authorization !");
  }
};

export const getAuth = req => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return null;
    }
    const token = authorization.split(" ")[1];
    const payload = verify(token, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (err) {
    console.log(err);
  }
};
