import express, { Request, Response } from "express";
import errorMiddleWare from "./middlewares/error.middleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.get("/api/status", (req: Request, res: Response) => {
  return res.json({
    message: "The service is alive, and active!",
    status: 200,
    success: true,
  });
});

app.use(errorMiddleWare);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
