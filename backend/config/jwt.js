import jwt from "jsonwebtoken"
 // ensures process.env.JWT_SECRET is loaded

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = "7d"

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables")
}

const generateToken = (userId, organizationId, role, branchId = 1) => {
  return jwt.sign(
    { userId, organizationId, role, branchId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("JWT verification failed:", error.message)
    throw new Error("Invalid token")
  }
}

export { generateToken, verifyToken, JWT_SECRET }
