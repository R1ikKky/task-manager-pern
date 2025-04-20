const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || ""

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "no token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
