import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

export const generateTokenandSetcookie = (res, userID, username) => {
  const token = jwt.sign(
    {
      userID: userID,
      username: username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("AICS", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    expires: new Date(DateTime.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};
