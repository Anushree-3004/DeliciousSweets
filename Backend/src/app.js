const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");
const { sendError } = require("./utils/apiResponse");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

// 404 handler (must be after all routes)
app.use((req, res) => {
  return sendError(res, {
    status: 404,
    code: "NOT_FOUND",
    message: "Route not found",
  });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || (status === 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED");
  return sendError(res, {
    status,
    code,
    message: err.message || "Internal Server Error",
    details: err.details,
  });
});

module.exports = app;
