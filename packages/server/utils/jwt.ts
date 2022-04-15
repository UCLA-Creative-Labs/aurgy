import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { logger } from '.';

export enum EXPIRATION {
  ONE_HOUR='1h',
  SEVEN_DAYS='7d',
}

export function genJwt(id: string, expiration: EXPIRATION ): string {
  if (!process.env.TOKEN_SECRET) {
    throw new Error('Error: JWT Token Secret is missing.');
  }
  return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn: expiration });
}

interface validateJwtOptions {
  req: Request;
  res: Response;
  next: NextFunction;
  token?: string;
  key: string;
}

function validateJwtToken({req, res, next, token, key}: validateJwtOptions): void {
  if (token == null) {res.sendStatus(401).end(); return;}

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: VerifyErrors, decoded: any) => {
    if (err) {
      logger.error(err);
      return res.status(403).json({[key]: true}).end();
    }
    req.body[key] = decoded.id;
    next();
  });
}

export function validateUserJwt(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  validateJwtToken({
    req,
    res,
    next,
    token,
    key: 'userId',
  });
}

export function validateLobbyJwt(req: Request, res: Response, next: NextFunction): void {
  const token = req.body.lobbyToken;

  validateJwtToken({
    req,
    res,
    next,
    token,
    key: 'lobbyId',
  });
}
