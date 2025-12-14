const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

function makeToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "name, email and password are required",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, {
        status: 409,
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email already registered",
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const role = adminEmail && adminEmail === email.toLowerCase() ? "admin" : "user";

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, {
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
      });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return sendError(res, {
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
      });
    }

    const token = makeToken(user);
    return res.json({ token, role: user.role });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };
