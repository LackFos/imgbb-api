import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { fileRouter } from "@/routes/file.router";
import { createConnection } from "@/libs/lmdb";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

export const lmdb = createConnection();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", fileRouter);

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "success", message: "Server is running" });
});

app.get("/", (_: Request, res: Response) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on http://localhost:${PORT}`);
  console.log(`⚡️ Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
