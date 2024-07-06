import express, { Request, Response } from "express";
import errorMiddleWare from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.route";
import asyncHandler from "express-async-handler";
import { userRouter } from "./routes/user.route";
import { organisationRouter } from "./routes/org.route";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(asyncHandler(authRouter));
app.use(asyncHandler(userRouter));
app.use(asyncHandler(organisationRouter));

app.get("/", (req: Request, res: Response) => {
  return res.redirect("https://coderoyalty.vercel.app");
});

app.get("/api/status", (req: Request, res: Response) => {
  return res.json({
    message: "The service is alive, and active!",
    status: 200,
    success: true,
  });
});

app.use(errorMiddleWare);

if (require.main == module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
