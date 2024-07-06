import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/jwt";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = null;
  if (!req.headers.authorization) {
    token = null;
  } else {
    const [name, tok] = req.headers.authorization.trim().split(" ");
    token = tok;
    if (name.toLowerCase() != "bearer") {
      token = null;
    }
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token is required",
      statusCode: 401,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Invalid token",
        statusCode: 403,
      });
    }

    req.user = decoded as any; // Attach decoded token payload to the request object
    next();
  });
};
