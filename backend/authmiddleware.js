import jwt from "jsonwebtoken";

export default function authmiddleware(req) {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decoded };
    } catch (err) {
      console.warn("Invalid token");
    }
  }
  return {};
}
