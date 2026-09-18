import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./env";
import { callsRouter } from "./routes/calls";
import { messagesRouter } from "./routes/messages";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/calls", callsRouter);
app.use("/api/messages", messagesRouter);

app.listen(env.port, () => {
  console.log(`LeadConnect backend listening on http://localhost:${env.port}`);
});
