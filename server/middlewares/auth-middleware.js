const { verifyJwt } = require("../configs/jwt");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Not authorized" });

    const payload = verifyJwt(token);
    const user = await User.findById(payload.id).select("-password");

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
