import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedUser);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
