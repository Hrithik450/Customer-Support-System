import passport from "passport";
import { DateTime } from "luxon";
import { generateTokenandSetcookie } from "../utils/generateToken.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "../database/fireabse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..config/config.env") });

const agentsRef = collection(db, "agents");

function getLiveDate(inputDate) {
  return inputDate.toFormat("yyyy-MM-dd HH:mm:ss");
}

async function checkUserByEmail(email, res) {
  try {
    const q = query(agentsRef, where("email", "==", email));
    const emailSnapshot = await getDocs(q);

    if (!emailSnapshot.empty) {
      return emailSnapshot.docs[0].data();
    }

    return null;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

export const logout = async (req, res, next) => {
  res.clearCookie("AICS", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.status(200).json({
    success: true,
    message: "Successfully logged out!",
    user: null,
  });
};

export const googleAuth = (req, res, next) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const GoogleID = profile.id;

          const userDocRef = doc(agentsRef, GoogleID);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            const newUser = {
              userID: GoogleID,
              username: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              role: "Employee",
              createdAt: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
              lastActive: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
            };

            const userExists = await checkUserByEmail(newUser.email, res);
            if (userExists) {
              const existingUserDocRef = doc(agentsRef, userExists.userID);
              await updateDoc(existingUserDocRef, {
                lastLogin: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
              });

              return done(null, { userID: userExists.userID });
            }

            await setDoc(userDocRef, newUser);

            return done(null, { userID: newUser.userID });
          } else {
            await updateDoc(userDocRef, {
              lastLogin: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
            });
            return done(null, { userID: GoogleID });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export const setCookie = async (req, res, next) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const UserDocRef = doc(agentsRef, userID);
    const userDoc = await getDoc(UserDocRef);

    if (!userDoc.exists()) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User ID." });
    }
    const userData = userDoc.data();
    const token = generateTokenandSetcookie(res, userID, userData.username);

    return res.status(200).json({
      success: true,
      user: { ...userDoc.data(), token },
      message: "Login successful!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const Profile = async (req, res, next) => {
  try {
    const UserId = req.user.userID;

    if (!UserId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const UserDocRef = doc(agentsRef, UserId);
    const UserSnapShot = await getDoc(UserDocRef);

    if (!UserSnapShot.exists()) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const user = UserSnapShot.data();
    return res.status(200).json({
      success: true,
      user: {
        ...user,
        password: null,
        lastActive: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agentsDoc = await getDocs(collection(db, "agents"));

    let agents = [];

    if (!agentsDoc.empty) {
      agentsDoc.forEach((doc) => {
        agents.push({ ...doc.data() });
      });
    }

    return res.status(200).json({
      success: true,
      agents: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ message: "Failed to fetch agents", error });
  }
};
