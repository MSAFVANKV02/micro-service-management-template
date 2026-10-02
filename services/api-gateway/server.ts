import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "inQueue API Gateway",
    message: "API Gateway is running",
  });
});

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
  }),
);

app.use(
  "/api/barber",
  createProxyMiddleware({
    target: process.env.BARBER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/barber": "",
    },
  }),
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`inQueue API Gateway running on port ${PORT}`);
});