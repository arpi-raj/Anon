import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const key = "Arpit Server";

export const sign = (data: any) => {
  const payload =
    typeof data === "string" ? { value: JSON.parse(data) } : { value: data };
  return jwt.sign(payload, key, { expiresIn: "1h" });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, key) as jwt.JwtPayload;

    console.log("Decoded:", decoded);
    console.log("Decoded keys:", Object.keys(decoded));

    // Store the correct user object in req.user
    (req as any).user = decoded.value;

    console.log("req.user:", (req as any).user);
    console.log("req.user.id:", (req as any).user?.id); // Ensure safe access

    next();
  } catch (error) {
    return res.status(403).json({ message: "Failed to authenticate token" });
  }
};
