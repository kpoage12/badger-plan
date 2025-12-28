import express from "express";
import cors from "cors";
import stateRouter from "./routes/state.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", stateRouter);

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(3001, ()=> console.log("API on http://localhost:3001"))