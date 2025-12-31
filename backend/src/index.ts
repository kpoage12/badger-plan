import express, { type Request, type Response, type NextFunction } from "express";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import scheduleRouter from "./routes/schedule.js";
import stateRouter from "./routes/state.js";

const app = express();


app.use(helmet());
app.use(express.json({ limit: "200kb" }));

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(cors(corsOptions));

app.use(
  "/api/schedule",
  rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/api", scheduleRouter);
app.use("/api", stateRouter);

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error && err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: { code: "CORS_FORBIDDEN", message: err.message } });
  }

  console.error(err);
  return res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Unexpected server error" } });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`API on http://localhost:${port}`));
