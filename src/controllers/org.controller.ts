import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { db } from "../db";
import { organisations, users, usersToOrgs } from "../db/schema";
import { orgSchema } from "../utils/schema";

const getOrganisationRecords = async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Access token is required",
      statusCode: 401,
    });
  }

  const orgs = await db.query.usersToOrgs.findMany({
    where: eq(usersToOrgs.userId, parseInt(user.id, 10)),
    with: {
      organisation: true,
    },
  });

  const organisations = orgs.map((org) => ({
    orgId: org.organisation.orgId,
    name: org.organisation.name,
    description: org.organisation.description,
  }));

  return res.status(200).json({
    status: "success",
    message: "Successfully fetched the data",
    organisations,
  });
};

const getOrganisationRecord = async (req: AuthRequest, res: Response) => {
  const orgId = parseInt(req.params.orgId, 10);

  const [organisation] = await db
    .select()
    .from(organisations)
    .where(eq(organisations.orgId, orgId));
  if (!organisation) {
    return res.status(404).json({
      status: "error",
      message: "The organisation does not exist",
    });
  }

  return res.status(200).json({
    data: organisation,
    status: "success",
    message: "Successfully fetched your organisations",
  });
};

const createOrganisation = async (req: AuthRequest, res: Response) => {
  const body = req.body;

  const parsedData = orgSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }

  const organisation = await db
    .insert(organisations)
    .values(parsedData.data)
    .returning();

  return res.status(201).json({
    status: "success",
    message: "Organisation created successfully",
    data: organisation,
  });
};

const addUserToOrganisation = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.body.userId, 10);
  const orgId = parseInt(req.params.orgId, 10);

  const org = await db.transaction(async (tx) => {
    const [org] = await tx
      .select()
      .from(organisations)
      .where(eq(organisations.orgId, orgId));

    const [user] = await tx.select().from(users).where(eq(users.id, userId));

    if (!org || !user) {
      return null;
    }

    const [newOrg] = await tx
      .insert(usersToOrgs)
      .values({
        userId: user.id,
        orgId: org.orgId,
      })
      .returning();

    if (!newOrg) {
      return null;
    }

    return newOrg;
  });

  if (!org) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
  return res.status(200).json({
    status: "success",
    message: "User added to organisation successfully",
  });
};

export {
  getOrganisationRecords,
  getOrganisationRecord,
  createOrganisation,
  addUserToOrganisation,
};
