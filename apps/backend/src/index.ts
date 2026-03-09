import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { dbConnect } from "./utils/database.js";
import { ApiError } from "./utils/ApiError.js";
import { environment } from "./utils/constants.js";
import promptRouter from "./routes/prompt.route.js";

async function startServer() {
  const app = express();
  const PORT = environment.port || 3030;
  const whitelist = process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173",
  ];

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());

  // DB connect
  await dbConnect();

  // CORS setup
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    }),
  );

  app.get("/health", async (req: Request, res: Response) => {
    try {
      res.status(200).json({ status: "healthy" });
    } catch (error) {
      res.status(503).json({ status: "unhealthy" });
    }
  });
  
  // routes
  app.use("/api/prompt", promptRouter);

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors,
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  });

  // Create HTTP server and init socket.io
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT} in ${environment.mode} mode`,
    );
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
