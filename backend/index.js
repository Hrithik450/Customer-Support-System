import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import ticketRoutes from "./routes/ticketRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import { googleAuth } from "./controllers/authController.js";
import passport from "passport";
import { Server } from "socket.io";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import db from "./database/fireabse.js";
import { DateTime } from "luxon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "config/config.env") });

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

googleAuth();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/team", teamRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log("Server running on port:", PORT)
);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("reconnectTeam", async ({ teamID, userID }) => {
    try {
      const agentRef = doc(db, "agents", userID);
      const agentDoc = await getDoc(agentRef);

      if (!agentDoc.exists()) return;

      const userData = agentDoc.data();
      const user = {
        active: true,
        role: userData.role,
        userID: userData.userID,
        username: userData.username,
      };

      const teamRef = doc(db, "teams", teamID);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        const currentMembers = teamData.members || [];

        const userInTeam = currentMembers.find(
          (member) => member?.userID === user.userID
        );
        if (userInTeam) {
          const updatedMembers = currentMembers.map((member) =>
            member?.userID === user.userID
              ? { ...member, id: socket.id }
              : member
          );

          const previousMessages = teamDoc.data()?.chats || [];
          await updateDoc(teamRef, { members: updatedMembers });

          socket.join(teamID);

          const exists = onlineUsers.some((u) => u.userID === userID);
          if (!exists) {
            onlineUsers.push({ userID, socketID: socket.id });
          }

          socket.emit("previousMessages", previousMessages);
          io.to(teamID).emit("teamUpdate", updatedMembers);
          io.to(teamID).emit("reconnected", onlineUsers);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("joinTeam", async ({ teamID, userID }) => {
    const agentRef = doc(db, "agents", userID);
    const agentDoc = await getDoc(agentRef);

    if (!agentDoc.exists()) return;

    const userData = agentDoc.data();
    const user = {
      active: true,
      role: userData.role,
      userID: userData.userID,
      username: userData.username,
    };

    socket.join(teamID);

    const teamRef = doc(db, "teams", teamID);
    const teamDoc = await getDoc(teamRef);

    let currentTeamMembers = [];
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      currentTeamMembers = teamData.members || [];
    }

    const userExists = currentTeamMembers.some((m) => m.id === socket.id);

    if (!userExists) {
      currentTeamMembers.push({ id: socket.id, ...user });

      await setDoc(
        teamRef,
        {
          members: currentTeamMembers,
          timestamp: DateTime.now().setZone("Asia/Kolkata").toMillis(),
        },
        { merge: true }
      );

      await updateDoc(agentRef, {
        teams: arrayUnion({ teamID: teamID, teamName: teamDoc.data().name }),
      });
    }

    io.to(teamID).emit("teamUpdate", currentTeamMembers);
    const previousMessages = teamDoc.data()?.chats || [];
    socket.emit("previousMessages", previousMessages);
    socket.emit("joinedTeam", userID);
  });

  socket.on("sendMessage", async ({ teamID, message }) => {
    const messageWithUser = {
      ...message,
    };

    const teamRef = doc(db, "teams", teamID);
    const teamDoc = await getDoc(teamRef);

    let currentChats = [];
    if (teamDoc.exists()) {
      const chatData = teamDoc.data();

      currentChats = chatData.chats || [];
      currentChats.push(messageWithUser);

      await setDoc(teamRef, { chats: currentChats }, { merge: true });
      io.to(teamID).emit("receiveMessage", messageWithUser);
    }
  });

  socket.on("leaveTeam", async ({ userID, teamID, teamName }) => {
    try {
      const agentRef = doc(db, "agents", userID);
      const agentDoc = await getDoc(agentRef);

      if (!agentDoc.exists()) return;

      await updateDoc(agentRef, {
        teams: arrayRemove({ teamID: teamID, teamName: teamName }),
      });

      const teamRef = doc(db, "teams", teamID);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        let teamData = teamDoc.data();
        let currentMembers = teamData.members || [];

        const user = currentMembers.find((u) => u.userID === userID);
        if (!user) return;

        const socketID = user.id;

        const updatedMembers = currentMembers.filter(
          (u) => u.userID !== userID
        );

        await setDoc(teamRef, { members: updatedMembers }, { merge: true });

        io.to(socketID).emit("kickedOut", userID);
        const targetSocket = io.sockets.sockets.get(socketID);
        if (targetSocket) {
          targetSocket.leave(teamID);
        }

        io.to(teamID).emit("teamUpdate", updatedMembers);
        socket.emit("removedUser", userID);
      }
    } catch (error) {
      console.error("Error in leaveTeam:", error);
    }
  });

  socket.on("disconnect", async () => {
    const user = onlineUsers.find((u) => u.socketID === socket.id);

    if (user) {
      onlineUsers = onlineUsers.filter((u) => u.socketID !== socket.id);
      io.emit("disconnected", onlineUsers);
    }
  });
});
