const { sendError } = require("../utils/apiResponse");

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return sendError(res, {
      status: 403,
      code: "ADMIN_REQUIRED",
      message: "Admin access required",
    });
  }

  return next();
}

module.exports = adminMiddleware;
