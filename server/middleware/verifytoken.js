import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accesstoken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decoded.userID;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
