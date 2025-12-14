function sendError(res, { status = 500, code = "INTERNAL_ERROR", message = "Internal Server Error", details }) {
  const body = {
    success: false,
    error: {
      status,
      code,
      message,
    },
  };

  if (details !== undefined) {
    body.error.details = details;
  }

  return res.status(status).json(body);
}

module.exports = { sendError };
