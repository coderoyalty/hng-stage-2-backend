import express from "express";
import { getUserRecord } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/api/users/:id", verifyToken, getUserRecord);

export { router as userRouter };
