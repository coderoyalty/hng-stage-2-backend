import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  addUserToOrganisation,
  createOrganisation,
  getOrganisationRecord,
  getOrganisationRecords,
} from "../controllers/org.controller";

const router = express.Router();

router.get("/api/organisations/", verifyToken, getOrganisationRecords);
router.post("/api/organisations/", verifyToken, createOrganisation);
router.get("/api/organisations/:orgId", verifyToken, getOrganisationRecord);
router.post("/api/organisations/:orgId/users", addUserToOrganisation);
export { router as organisationRouter };
