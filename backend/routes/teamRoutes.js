import express from "express";
import {
  addNewTeam,
  createNewWorkflowRule,
  deleteTeam,
  deleteWorkflowRule,
  fetchTeamChatsFromDB,
  fetchTeamMembersFromDB,
  getAllWorkflowRules,
  getTeams,
  reorderWorkflowRules,
  updateWorkflowRule,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/getTeams", getTeams);
router.post("/addTeam", addNewTeam);
router.post("/deleteTeam/:teamID", deleteTeam);
router.get("/getworkflows", getAllWorkflowRules);
router.post("/createworkflow", createNewWorkflowRule);
router.put("/updateworkflow", updateWorkflowRule);
router.put("/reorderworkflow", reorderWorkflowRules);
router.delete("/deleteworkflow/:id", deleteWorkflowRule);
router.get("/teamChats/:teamID", fetchTeamChatsFromDB);
router.get("/teamMembers/:teamID", fetchTeamMembersFromDB);

export default router;
