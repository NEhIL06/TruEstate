import express from "express";
import cors from "cors";
import { env } from "./utils/env";
import transactionRoutes from "./routes/transaction.routes";
import { errorHandler, notFoundHandler } from "./utils/errors";

const app = express();

const origin=[
    "http://localhost:3000",
    process.env.FRONTEND_URL,
    "https://truestate.vercel.app"
]

app.use(cors(
    {
        origin: origin as string[],
        credentials: true
    }
));
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/api", transactionRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});

export default app;
