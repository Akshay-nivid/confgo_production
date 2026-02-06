import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config/index';

const SECRET_KEY: Secret = config.jwt.secret;

// helper to narrow the type of expiresIn
const accessTokenExpire: SignOptions['expiresIn'] =
  config.jwt.expire as SignOptions['expiresIn'];

const refreshTokenExpire: SignOptions['expiresIn'] =
  config.jwt.refreshExpire as SignOptions['expiresIn'];

export const generateToken = (payload: any) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: accessTokenExpire });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: refreshTokenExpire,
  });
};

export const verifyRefreshToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.refreshSecret, (err, decoded) => {
      if (err) return reject('Invalid or expired refresh token');
      resolve(decoded);
    });
  });
};
