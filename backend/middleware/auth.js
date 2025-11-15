import { verifyToken } from "../config/jwt.js"

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid token" })
  }
}

const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }
    next()
  }
}

export { authMiddleware, roleCheck }
