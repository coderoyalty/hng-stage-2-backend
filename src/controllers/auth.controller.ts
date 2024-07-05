import express, { Request, Response } from "express";
import { loginSchema, userSchema } from "../utils/schema";

const register = (req: Request, res: Response) => {
  const data = req.body;

  const user = userSchema.safeParse(data);

  if (!user.success) {
    const errors = user.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({ errors });
  }

  //TODO: do email, and phone verification here!
  //TODO: etc.
  return res.status(201).json({ data });
};

const login = (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
  }
};

export { register, login };
