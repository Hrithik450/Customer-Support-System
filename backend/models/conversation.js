import { collection, addDoc } from "firebase/firestore";
import db from "../database/fireabse.js";
import { DateTime } from "luxon";

export function getLiveDate(inputDate) {
  return inputDate.toFormat("yyyy-MM-dd HH:mm:ss");
}

async function addConversation(conversation) {
  const conversationsRef = collection(db, "conversations");

  const docRef = await addDoc(conversationsRef, {
    id: conversation.id,
    category: conversation.category,
    sentiment: conversation.sentiment,
    priority: conversation.priority,
    status: conversation.status,
    createdAt: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
    updatedAt: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
    participants: {
      customerId: conversation.participants.customerId,
      agentId: conversation.participants.agentId | null,
    },
    messages: conversation.messages,
  });

  return docRef.id;
}

export default addConversation;
