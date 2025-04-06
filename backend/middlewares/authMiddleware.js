import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = await (req.cookies?.AICS ||
    req.headers?.authorization?.split(" ")[1]);

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "User is not logged in",
      user: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Session expired, please login again",
      user: null,
    });
  }
};
