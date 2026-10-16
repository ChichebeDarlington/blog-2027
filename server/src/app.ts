import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import projectRoutes from "./routes/projectRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = [
  env.CLIENT_ORIGIN, // Local Vite dev server
  "https://chichebedarlington.github.io", // Your live GitHub Pages domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.disable("x-powered-by");
app.use(helmet());
// app.use(
//   cors({
//     origin: [env.CLIENT_ORIGIN, "http://localhost:5173"],
//     credentials: true,
//   }),
// );

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(
  "/api/v1/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.get("/api/v1/health", (_req, res) =>
  res.json({ data: { status: "ok", timestamp: new Date().toISOString() } }),
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
