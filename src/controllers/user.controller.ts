import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db";
import { SelectUser, users, usersToOrgs } from "../db/schema";
import { AuthRequest } from "../middlewares/auth.middleware";

async function getUserById(id: SelectUser["id"]): Promise<
  Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  }>
> {
  return db.select().from(users).where(eq(users.id, id));
}

const getUserRecord = async (req: AuthRequest, res: Response) => {
  const userId: SelectUser["id"] = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }

  // Get the user record
  const [user] = await getUserById(userId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
      statusCode: 404,
    });
  }

  return res.status(200).json({
    status: "success",
    message: `User request successful`,
    data: {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });
};

export { getUserRecord };
