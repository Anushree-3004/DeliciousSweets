const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiResponse");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, {
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Missing or invalid Authorization header",
    });
  }

  const token = header.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.userId,
      role: payload.role,
    };
    return next();
  } catch (e) {
    return sendError(res, {
      status: 401,
      code: "INVALID_TOKEN",
      message: "Invalid token",
    });
  }
}

module.exports = authMiddleware;
