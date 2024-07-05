import express, { Request, Response } from "express";

const router = express.Router();

router.post("/auth/register", (req: Request, res: Response) => {
  const payload = req.body;

  return res.status(201).json({
    payload,
  });
});

export { router as authRouter };
