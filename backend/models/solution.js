import { collection, addDoc } from "firebase/firestore";
import db from "../database/fireabse.js";
import { getLiveDate } from "./conversation.js";
import { DateTime } from "luxon";

async function addSolution(solution) {
  const solutionsRef = collection(db, "solutions");

  const docRef = await addDoc(solutionsRef, {
    id: solution.id,
    issuePattern: solution.issuePattern,
    solution: solution.solution,
    effectivenessScore: solution.effectivenessScore,
    lastUsed: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
    usedCount: solution.usedCount,
    relatedTickets: solution.relatedTickets,
  });

  return docRef.id;
}

export default addSolution;
