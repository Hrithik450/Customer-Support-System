import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getAgents,
  logout,
  Profile,
  setCookie,
} from "../controllers/authController.js";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const router = express.Router();

router.get("/profile", isAuthenticated, Profile);
router.post("/set-cookie", setCookie);
router.get("/agents", getAgents);
router.get("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/?authpage=open`,
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const url = `${process.env.FRONTEND_URL}/?authpage=open&tempToken=${user.userID}`;
    res.redirect(url);
  }
);

export default router;
