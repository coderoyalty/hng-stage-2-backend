import express, { Request, Response } from "express";
import { loginSchema, userSchema } from "../utils/schema";
import { db } from "../db";
import { organisations, users, usersToOrgs } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "dotenv";

config();

const register = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = userSchema.safeParse(data);

  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({ errors });
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsedData.data.email));

  if (existingUser) {
    return res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }

  const user = parsedData.data;

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await db.transaction(async (trx) => {
    const [newUser] = await trx
      .insert(users)
      .values({ ...user, password: hashedPassword })
      .returning();
    const [newOrg] = await trx
      .insert(organisations)
      .values({
        name: `${user.firstName}'s Organisation`,
        description: `${user.firstName}'s default organisation`,
      })
      .returning();

    await trx
      .insert(usersToOrgs)
      .values({ orgId: newOrg.orgId, userId: newUser.id });

    return newUser;
  });

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );

  return res.status(201).json({
    status: "success",
    message: "Registration successful",
    data: {
      user: {
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
      },
      accessToken,
    },
  });
};

const login = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(422).json({ errors });
  }

  const loginData = parsedData.data;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, loginData.email));

  if (result.length === 0) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const user = result[0];
  if (!(await bcrypt.compare(loginData.password, user.password))) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );

  return res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken,
      user: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    },
  });
};

export { register, login };
