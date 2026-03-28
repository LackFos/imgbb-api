import express, { Request, Response } from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
