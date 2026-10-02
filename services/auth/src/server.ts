import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "inQueue Auth Service",
    message: "Auth service is running",
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(
      `inQueue Auth Service running on port ${env.PORT}`,
    );
  });
};

startServer();