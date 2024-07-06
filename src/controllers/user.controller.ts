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

  // Get the user record
  const [user] = await getUserById(userId);

  console.log(user);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
      statusCode: 404,
    });
  }

  // Get organisations the user belongs to or created
  const orgs = await db.query.usersToOrgs.findMany({
    where: eq(usersToOrgs.userId, user.id),
    with: {
      organisation: {
        columns: {
          orgId: false,
        },
      },
    },
  });

  return res.status(200).json({
    status: "success",
    message: `${user.firstName} here are the organisations you created`,
    data: {
      user: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
      organisations: orgs,
    },
  });
};

export { getUserRecord };
