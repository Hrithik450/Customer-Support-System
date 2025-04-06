import { collection, addDoc } from "firebase/firestore";
import db from "../database/fireabse.js";
import { getLiveDate } from "./conversation.js";
import { DateTime } from "luxon";

async function addAgent(agent) {
  const agentsRef = collection(db, "agents");

  const docRef = await addDoc(agentsRef, {
    id: agent.id,
    name: agent.name,
    skills: agent.skills,
    currentLoad: agent.currentLoad,
    availability: agent.availability | "break",
    lastLogin: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
  });

  return docRef.id;
}

export default addAgent;
