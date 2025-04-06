import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import db from "../database/fireabse.js";
import { DateTime } from "luxon";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const ticketsRef = collection(db, "tickets");
const agentsTicketsRef = collection(db, "agentsTickets");
const solutionsRef = collection(db, "ticketsResoved");
const agentsRef = collection(db, "agents");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function getLiveDate(inputDate) {
  return inputDate.toFormat("yyyy-MM-dd HH:mm:ss");
}

const workflowRulesColl = collection(db, "workflowRules");
const agentsColl = collection(db, "agents");

async function analyzeAI(messages, category, workflows, agents) {
  const chatTranscript = messages
    .map((msg) => `${msg.from}: ${msg.message}`)
    .join("\n");

  let avgResolutionTimeForCategory = null;

  const solutionsQuery = query(solutionsRef, where("category", "==", category));
  const solutionsSnapshot = await getDocs(solutionsQuery);

  if (!solutionsSnapshot.empty) {
    let totalResolutionTime = 0;
    let solutionCount = 0;
    solutionsSnapshot.forEach((doc) => {
      const solutionData = doc.data();
      if (solutionData.resolutionTime) {
        totalResolutionTime += solutionData.resolutionTime;
        solutionCount++;
      }
    });

    if (solutionCount > 0) {
      avgResolutionTimeForCategory = Math.round(
        totalResolutionTime / solutionCount
      );
    }
  }

  let resolutionTimeContext = "";
  if (avgResolutionTimeForCategory !== null) {
    resolutionTimeContext = `Based on past similar cases, the average resolution time for this category is approximately ${avgResolutionTimeForCategory} minutes.`;
  } else {
    resolutionTimeContext =
      "Based on the conversation, estimate the average resolution time for this issue in minutes.";
  }

  const prompt = `
You are an AI agent for a customer support ticketing system.

Given the following:
1. Conversation details:
Category: ${category}
Messages: ${chatTranscript}

2. Available Agents:
${agents
  .map(
    (agent) => `
- ID: ${agent.id}
  Teams: ${agent.teams.map((team) => team.teamName).join(", ")}
  Avg Resolution Time: ${agent.avgResolutionTime} mins
  Customer Satisfaction Score: ${agent.satisfactionScore}/5
  Current Workload: ${agent.workload} active tickets
`
  )
  .join("\n")}

3. Workflow Rules:
${workflows
  .map(
    (workflow) => `
- ID: ${workflow.id}
  Action: ${workflow.action}
  Trigger: ${workflow.trigger}
  Condition: ${workflow.condition}
  Value: ${workflow.value}
  Route Team: ${workflow.routeTeam || "N/A"}
  Priority: ${workflow.priority}
`
  )
  .join("\n")}

${resolutionTimeContext}

Do the following:
- Summarize the customer's issue in one sentence.
- Predict customer sentiment as Angry, Neutral, or Happy.
- Evaluate the workflow rules based on the 'category' trigger and the current category. If a 'route_to' action is found, identify the target 'routeTeam'.
- Filter available agents to include only those who are part of the identified 'routeTeam' (if a workflow rule matched). If no workflow rule matches for routing, consider all agents.
- Choose the BEST agent from the filtered list to assign based on category, performance (low resolution time, high satisfaction), and low workload.
- Provide an estimated average resolution time for this specific issue in minutes. If historical data for this category is unavailable, make a reasonable estimation based on the conversation.

Respond ONLY in this format:
Summary: <summary>
Sentiment: <sentiment>
BestAgentID: <agent-id>
EstimatedResolutionTime: <minutes>
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const summaryMatch = responseText.match(/Summary:\s*(.*)/i);
  const sentimentMatch = responseText.match(/Sentiment:\s*(.*)/i);
  const agentMatch = responseText.match(/BestAgentID:\s*(.*)/i);
  const resolutionTimeMatch = responseText.match(
    /EstimatedResolutionTime:\s*(\d+)/i
  );

  const summary = summaryMatch ? summaryMatch[1] : "No summary available.";
  const sentimentRaw = sentimentMatch
    ? sentimentMatch[1].toLowerCase()
    : "neutral";
  const bestAgentID = agentMatch ? agentMatch[1].trim() : null;
  const estimatedResolutionTime = resolutionTimeMatch
    ? parseInt(resolutionTimeMatch[1])
    : null;

  let sentimentEmoji = "😐 Neutral";
  if (sentimentRaw.includes("frustrated")) sentimentEmoji = "😠 Frustrated";
  else if (sentimentRaw.includes("happy")) sentimentEmoji = "😊 Happy";
  else if (sentimentRaw.includes("confused")) sentimentEmoji = "🤔 Confused";

  return {
    summary,
    sentiment: sentimentEmoji,
    bestAgentID,
    estimatedResolutionTime,
  };
}

export const newTicket = async (req, res) => {
  try {
    const { conversation } = req.body;
    const workflowDoc = await getDocs(workflowRulesColl);
    const agentsDoc = await getDocs(agentsColl);

    let workflows = [];
    if (!workflowDoc.empty) {
      workflows = workflowDoc.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          action: data.action,
          trigger: data.trigger,
          condition: data.condition,
          value: data.value,
          routeTeam: data.routeTeam,
          priority: data.priority,
        };
      });
    }

    let agents = [];
    if (!agentsDoc.empty) {
      agents = agentsDoc.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.userID,
          teams: data.teams.map((team) => ({ ...team })),
          avgResolutionTime: data.avgResolutionTime,
          satisfactionScore: data.satisfactionScore,
          workload: data.workload,
        };
      });
    }

    const { summary, sentiment, bestAgentID, estimatedResolutionTime } =
      await analyzeAI(
        conversation.messages,
        conversation.category,
        workflows,
        agents
      );

    const ticket = {
      id: conversation.id,
      category: conversation.category,
      priority: conversation.priority,
      sentiment,
      summary,
      status: conversation.status,
      participants: {
        customerID: conversation.participants.customerID,
        agentID: bestAgentID,
      },
      messages: conversation.messages || [],
      timestamp: getLiveDate(DateTime.now().setZone("Asia/Kolkata")),
      estimatedResolutionTime,
    };

    const ticketDocRef = doc(ticketsRef, conversation.id);
    const ticketSnapshot = await getDoc(ticketDocRef);

    if (!ticketSnapshot.exists()) {
      await setDoc(ticketDocRef, ticket);

      if (bestAgentID) {
        const agentTicketsDocRef = doc(agentsTicketsRef, bestAgentID);
        const agentTicketsSnapshot = await getDoc(agentTicketsDocRef);

        const existingTickets = agentTicketsSnapshot.exists()
          ? agentTicketsSnapshot.data().tickets || []
          : [];

        const updatedTickets = [...existingTickets, conversation.id];

        await setDoc(
          agentTicketsDocRef,
          { tickets: updatedTickets },
          { merge: true }
        );

        const agentDocRef = doc(agentsRef, bestAgentID);
        const agentSnap = await getDoc(agentDocRef);

        if (agentSnap.exists()) {
          const PrevWorkload = agentSnap.data().workload;
          await updateDoc(agentDocRef, { workload: PrevWorkload + 1 });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Ticket raised successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchAgentTickets = async (req, res) => {
  try {
    const { agentID } = req.params;

    const agentTicketDocRef = doc(db, "agentsTickets", agentID);
    const agentTicketSnap = await getDoc(agentTicketDocRef);

    if (agentTicketSnap.exists()) {
      const agentTicketData = agentTicketSnap.data();
      const ticketIds = agentTicketData.tickets || [];
      const agentTickets = [];

      if (ticketIds.length > 0) {
        const ticketsCollectionRef = collection(db, "tickets");
        for (const ticketId of ticketIds) {
          const ticketDocRef = doc(ticketsCollectionRef, ticketId);
          const ticketSnap = await getDoc(ticketDocRef);
          if (ticketSnap.exists()) {
            agentTickets.push({ id: ticketSnap.id, ...ticketSnap.data() });
          }
        }
      }

      return res.status(200).json({
        success: true,
        agentTickets,
      });
    }

    return res.status(200).json({
      success: true,
      agentTickets: [],
    });
  } catch (error) {
    console.error("Error fetching agent tickets:", error);

    return res.status(500).json({
      message: "Failed to fetch agent tickets.",
      error: error.message,
    });
  }
};
