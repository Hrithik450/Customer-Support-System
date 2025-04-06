import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import db from "../database/fireabse.js";
import { DateTime } from "luxon";

const workflowRulesColl = collection(db, "workflowRules");

export const getTeams = async (req, res) => {
  try {
    const teamsRef = collection(db, "teams");
    const teamDocs = await getDocs(teamsRef);

    let teams = [];

    if (!teamDocs.empty) {
      teams = teamDocs.docs.map((doc) => {
        const data = doc.data();
        return {
          teamID: doc.id,
          teamName: data.name,
          teamMembers: data.members,
          teamCapacity: data.capacity,
        };
      });
    }

    return res.status(200).json({
      success: true,
      teams: teams,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addNewTeam = async (req, res) => {
  try {
    const { teamName, teamMembers = [], teamCapacity } = req.body;

    if (!teamName || !teamCapacity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: teamName or teamCapacity",
      });
    }

    const newTeam = {
      name: teamName,
      members: teamMembers,
      capacity: teamCapacity,
      timestamp: DateTime.now().setZone("Asia/Kolkata").toMillis(),
    };

    const teamsRef = collection(db, "teams");
    const docRef = await addDoc(teamsRef, newTeam);

    return res.status(201).json({
      success: true,
      message: "New team created successfully",
      team: {
        teamCapacity: newTeam.capacity,
        teamMembers: newTeam.members,
        teamName: newTeam.name,
        teamID: docRef.id,
      },
    });
  } catch (error) {
    console.log("Error in addNewTeam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { teamID } = req.params;

    if (!teamID) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: teamID",
      });
    }

    const teamDocRef = doc(db, "teams", teamID);
    await deleteDoc(teamDocRef);

    const teamsRef = collection(db, "teams");
    const teamDocs = await getDocs(teamsRef);

    const remainingTeams = teamDocs.docs.map((doc) => ({
      teamID: doc.id,
      teamName: doc.data().name,
      teamMembers: doc.data().members,
      teamCapacity: doc.data().capacity,
    }));

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
      teams: remainingTeams,
    });
  } catch (error) {
    console.error("Error in deleteTeam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllWorkflowRules = async (req, res) => {
  try {
    const q = query(workflowRulesColl, orderBy("priority", "asc"));
    const querySnapshot = await getDocs(q);

    const rules = [];
    querySnapshot.forEach((doc) => {
      rules.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      rules: rules,
    });
  } catch (error) {
    console.error("Error getting workflow rules:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const createNewWorkflowRule = async (req, res) => {
  try {
    const { trigger, condition, value, action, routeTeam, color } = req.body;

    const q = query(workflowRulesColl, orderBy("priority", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    let priority = 1;
    if (!querySnapshot.empty) {
      const highestPriorityDoc = querySnapshot.docs[0];
      priority = highestPriorityDoc.data().priority + 1;
    }

    const newRuleData = {
      trigger,
      condition,
      value,
      action,
      routeTeam,
      color,
      priority,
    };

    const newRuleRef = doc(workflowRulesColl);
    await setDoc(newRuleRef, newRuleData);
    res.status(201).json({
      success: true,
      rule: { id: newRuleRef.id, ...newRuleData },
    });
  } catch (error) {
    console.error("Error creating new workflow rule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateWorkflowRule = async (req, res) => {
  try {
    const { id } = req.body;

    const ruleRef = doc(workflowRulesColl, id);
    const ruleSnapshot = await getDoc(ruleRef);

    if (!ruleSnapshot.exists()) {
      return res.status(404).json({ message: "Rule not found" });
    }

    await updateDoc(ruleRef, req.body);
    const updatedRuleSnapshot = await getDoc(ruleRef);
    res.status(200).json({
      success: true,
      rule: { id: updatedRuleSnapshot.id, ...updatedRuleSnapshot.data() },
    });
  } catch (error) {
    console.error("Error updating workflow rule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const reorderWorkflowRules = async (req, res) => {
  try {
    const { rules } = req.body;
    const batch = writeBatch(db);

    rules.forEach((rule, index) => {
      const ruleRef = doc(workflowRulesColl, rule.id);
      batch.update(ruleRef, { priority: index + 1 });
    });

    await batch.commit();

    const updatedRulesQuery = query(
      workflowRulesColl,
      orderBy("priority", "asc")
    );
    const updatedRulesSnapshot = await getDocs(updatedRulesQuery);
    const updatedRules = [];
    updatedRulesSnapshot.forEach((doc) => {
      updatedRules.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      message: "Rules reordered successfully",
      rules: updatedRules,
    });
  } catch (error) {
    console.error("Error reordering workflow rules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteWorkflowRule = async (req, res) => {
  try {
    const { id } = req.params;
    const ruleRef = doc(workflowRulesColl, id);
    const ruleSnapshot = await getDoc(ruleRef);

    if (!ruleSnapshot.exists()) {
      return res.status(404).json({ message: "Rule not found" });
    }

    const deletedPriority = ruleSnapshot.data().priority;
    await deleteDoc(ruleRef);

    const q = query(workflowRulesColl, where("priority", ">", deletedPriority));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, { priority: increment(-1) });
    });
    await batch.commit();

    const updatedRulesQuery = query(
      workflowRulesColl,
      orderBy("priority", "asc")
    );
    const updatedRulesSnapshot = await getDocs(updatedRulesQuery);
    const updatedRules = [];
    updatedRulesSnapshot.forEach((doc) => {
      updatedRules.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      message: "Rule deleted successfully",
      rules: updatedRules,
    });
  } catch (error) {
    console.error("Error deleting workflow rule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const fetchTeamChatsFromDB = async (req, res) => {
  const { teamID } = req.params;

  try {
    const teamRef = doc(db, "teams", teamID);
    const teamDoc = await getDoc(teamRef);

    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const chats = teamData.chats || [];
      return res.status(200).json({
        success: true,
        chats: chats,
      });
    } else {
      return res.status(200).json({
        success: true,
        chats: [],
      });
    }
  } catch (error) {
    console.log(`Error fetching chats for team ${teamID}:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const fetchTeamMembersFromDB = async (req, res) => {
  const { teamID } = req.params;

  try {
    const teamRef = doc(db, "teams", teamID);
    const teamDoc = await getDoc(teamRef);

    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const members = teamData.members || [];
      return res.status(200).json({
        success: true,
        members: members,
      });
    } else {
      return res.status(200).json({
        success: true,
        members: [],
      });
    }
  } catch (error) {
    console.error(`Error fetching members for team ${teamID}:`, error);
    throw error;
  }
};
