import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchprofile } from "../../../store/slices/auth/authThunks";
import CircularLoader from "../../../components/common/cirSpinner";
import Socket from "../socket";
import {
  loadPreviousMessages,
  sendChatMessage,
  setCurrentTeam,
  setOnlineMembers,
  setTeamMembers,
} from "../../../store/slices/team/teamSlice";
import { toast } from "react-toastify";
import { alertObject } from "../collaboration";
import { fetchUserTickets } from "../../../store/slices/ticket/ticketThunks";

const conversationThread = {
  summary: "Customer experiencing payment errors and frustration.",
  messages: [
    {
      sender: "Customer",
      text: "I tried to pay, but it keeps failing!",
      keyPhrases: ["pay", "failing"],
    },
    {
      sender: "Agent",
      text: "Could you please provide more details?",
      keyPhrases: [],
    },
    {
      sender: "Customer",
      text: "Yes, I tried with my Visa card and Paypal. I need to pay for the Premium subscription.",
      keyPhrases: ["Visa", "Paypal", "Premium"],
    },
  ],
  actionItems: [
    "Investigate payment gateway",
    "Check customer subscription status",
  ],
  suggestedReplies: [
    "I understand your frustration.",
    "Could you provide your order ID?",
  ],
};

const customerProfile = {
  name: "John Doe",
  history: "3 previous tickets",
  valueTier: "Gold",
  preferences: "Email updates",
};

const similarCases = [
  { id: 1, title: "Payment Gateway Error", solution: "Restarted server" },
  {
    id: 2,
    title: "Visa Card Issue",
    solution: "Advised customer to contact bank",
  },
];

const resolutionToolkit = [
  "Payment Troubleshooting Guide",
  "Subscription Management Workflow",
];

function formatTimestampForChat(timestamp) {
  const date = new Date(timestamp);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes}`;
}

function TicketView({ toggleChat }) {
  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false);
  const [resolutionType, setResolutionType] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [sendSurvey, setSendSurvey] = useState(true);
  const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const showChat = searchParams.get("showChat") || "close";

  const dispatch = useDispatch();
  const { user, authLoading } = useSelector((state) => state.authReducer);
  const { members, onlineMembers, currentTeam } = useSelector(
    (state) => state.teamReducer
  );

  const { tickets, ticketLoading } = useSelector(
    (state) => state.ticketReducer
  );

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [teamID, setTeamID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setCurrentTeam(user?.teams?.[0] || {}));

    if (user?.userID && user?.teams?.length > 0 && user?.teams[0]?.teamID) {
      Socket.emit("reconnectTeam", {
        teamID: user?.teams[0]?.teamID,
        userID: user?.userID,
      });
    }
  }, [user?.teams, user?.userID]);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(fetchprofile()).unwrap();
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchTickets = async () => {
      await dispatch(fetchUserTickets({ userID: user?.userID })).unwrap();
    };

    if (user?.userID) fetchTickets();
  }, [dispatch, user?.userID]);

  useEffect(() => {
    if (!user?.userID) return;

    Socket.connect();
    const onJoinedTeam = async () => {
      toast.success("Successfully Joined the team", alertObject);
      await dispatch(fetchprofile()).unwrap();
      setShowJoinTeamModal(false);
      setTeamID("");
    };

    Socket.on("joinedTeam", onJoinedTeam);

    if (!user?.teams || user.teams.length === 0) return;

    const onTeamUpdate = (members) => {
      dispatch(setTeamMembers(members));
    };

    const onReceiveMessage = (message) => {
      dispatch(sendChatMessage(message));
    };

    const onReconnected = (onlineUsers) => {
      dispatch(setOnlineMembers(onlineUsers));
    };

    const onPrevMessages = (messages) => {
      dispatch(loadPreviousMessages(messages));
    };

    const onDisconnect = (onlineUsers) => {
      dispatch(setOnlineMembers(onlineUsers));
    };

    const onRemoveUser = (userID) => {
      toast.success(`Successfully removed ${userID}`, alertObject);
    };

    const onKickOut = async () => {
      toast.error("You have been removed from the team", alertObject);
      await dispatch(fetchprofile()).unwrap();
    };

    Socket.on("reconnected", onReconnected);
    Socket.on("previousMessages", onPrevMessages);
    Socket.on("teamUpdate", onTeamUpdate);
    Socket.on("receiveMessage", onReceiveMessage);
    Socket.on("disconnected", onDisconnect);
    Socket.on("removedUser", onRemoveUser);
    Socket.on("kickedOut", onKickOut);

    return () => {
      Socket.off("teamUpdate", onTeamUpdate);
      Socket.off("receiveMessage", onReceiveMessage);
      Socket.off("previousMessages", onPrevMessages);
      Socket.off("reconnected", onReconnected);
      Socket.off("disconnected", onDisconnect);
      Socket.off("removedUser", onRemoveUser);
      Socket.off("joinedTeam", onJoinedTeam);
      Socket.off("kickedOut", onKickOut);
    };
  }, [dispatch, user?.teams, user?.userID]);

  useEffect(() => {
    if (tickets?.[0]) setSelectedTicket(tickets[0]);
  }, [tickets]);

  const handleCloseTicket = () => {
    const updatedTickets = ticketQueue.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            status: "closed",
            closedAt: new Date().toISOString(),
            resolutionType,
            resolutionNotes,
          }
        : ticket
    );

    setTicketQueue(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      status: "closed",
      closedAt: new Date().toISOString(),
      resolutionType,
      resolutionNotes,
    });

    setShowCloseTicketModal(false);
  };

  const handleJoinTeam = () => {
    try {
      if (teamID === "")
        return toast.error("Please provide teamID", alertObject);

      const alreadyJoined = user?.teams?.some((team) => team.teamID === teamID);
      if (alreadyJoined) {
        toast.warn("You are already a member of this team!", alertObject);
        setShowJoinTeamModal(false);
        return;
      }

      Socket.emit("joinTeam", { teamID, userID: user?.userID });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = (userID) => {
    Socket.emit("leaveTeam", {
      userID,
      teamID: currentTeam?.teamID,
      teamName: currentTeam?.teamName,
    });
  };

  const handleTeamChange = async (teamID) => {
    const selectedTeam = user?.teams.find((team) => team.teamID === teamID);
    dispatch(setCurrentTeam(selectedTeam));

    Socket.emit("reconnectTeam", {
      teamID: teamID,
      userID: user?.userID,
    });
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <CircularLoader color={"gray"} />
      </div>
    );
  }

  if (!user?.teams || user.teams.length === 0 || showJoinTeamModal) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full bg-white text-black rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Join a Team</h2>

          <p className="text-gray-600 mb-6">
            Enter your team ID below to join an existing team
          </p>

          <div className="mb-6">
            <label
              htmlFor="teamID"
              className="block text-sm font-medium text-gray-700 mb-1 text-left"
            >
              Team ID
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="teamID"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 border-gray-300 rounded-lg"
                placeholder="e.g. TEAM-12345"
                value={teamID}
                onChange={(e) => setTeamID(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={handleJoinTeam}
                  disabled={!teamID.trim()}
                  className={`px-4 h-full rounded-r-lg text-white cursor-pointer ${
                    teamID.trim()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? <CircularLoader /> : "Join"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Ask your team administrator if you don't know the Team ID
            </p>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>After joining, you'll be able to:</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Collaborate with team members
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Access shared resources
              </li>
              <li className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Participate in team discussions
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-screen bg-gray-50">
      <div className="bg-white text-black p-4 border-r border-gray-200 overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10">
          <h2 className="text-xl font-bold text-gray-800">Ticket Queue</h2>
          <div className="flex space-x-2">
            <button className="p-1 rounded-md bg-gray-100 hover:bg-gray-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {tickets &&
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                  selectedTicket && selectedTicket.id === ticket.id
                    ? "border-blue-400 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 truncate">
                    {ticket.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      ticket.priority === "Critical" ||
                      ticket.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : ticket.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        ticket.sentiment === "😊 Happy"
                          ? "bg-green-500"
                          : ticket.sentiment === "😠 Angry"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    {ticket.sentiment}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {ticket.estimatedResolutionTime}min
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white text-black px-4 border-r border-gray-200 overflow-y-auto shadow-sm">
        {ticketLoading ? (
          <div className="h-full flex items-center justify-center">
            <CircularLoader />
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white py-4 px-2 z-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Conversation Thread
              </h2>

              <div className="flex justify-between items-center mb-4">
                {selectedTicket && selectedTicket.status === "closed" ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Ticket Closed
                  </span>
                ) : (
                  <button
                    onClick={() => setShowCloseTicketModal(true)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-full flex items-center cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Close Ticket
                  </button>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                >
                  <h3 className="font-semibold text-blue-800">Summary</h3>
                  <svg
                    className={`w-5 h-5 text-blue-500 transition-transform duration-200 ${
                      isSummaryExpanded ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isSummaryExpanded ? (
                  <p className="text-sm text-gray-700 mt-2">
                    {selectedTicket?.summary}
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 mt-2 truncate">
                    {selectedTicket?.summary || "No summary available"}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {selectedTicket &&
                selectedTicket.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.from === "Customer"
                        ? "bg-orange-50 border border-orange-100"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">
                        {message.from}:
                      </p>
                      <span className="text-xs text-gray-500">
                        {message.timestamp
                          ? formatTimestampForChat(message.timestamp)
                          : ""}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
            </div>
            <div className="mt-6 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                Suggested Replies By AI
              </h3>

              <div className="flex flex-wrap gap-2">
                {conversationThread.suggestedReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors duration-200">
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white text-black p-4 overflow-y-auto shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Context Panel</h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-800 font-semibold">
                {customerProfile.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {customerProfile.name}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  customerProfile.valueTier === "Premium"
                    ? "bg-green-100 text-green-800"
                    : customerProfile.valueTier === "Standard"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {customerProfile.valueTier}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Last Contact</p>
              <p className="font-medium">2 days ago</p>
            </div>
            <div>
              <p className="text-gray-500">Lifetime Value</p>
              <p className="font-medium">$1,240</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-gray-500 mb-1">Preferences</p>
            <div className="flex flex-wrap gap-1">
              {customerProfile.preferences.split(",").map((pref, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                >
                  {pref.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Similar Cases</h3>
          <div className="space-y-3">
            {similarCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <p className="font-medium text-sm">{caseItem.title}</p>
                <p className="text-xs text-gray-600 truncate">
                  {caseItem.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">
            Resolution Toolkit
          </h3>
          <div className="space-y-2">
            {resolutionToolkit.map((tool, index) => (
              <div key={index} className="flex items-start">
                <div className="mt-1 mr-2 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">{tool}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-xl p-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Team Members
              </h3>

              <div className="flex space-x-2">
                <div className="relative mr-2">
                  <select
                    value={currentTeam?.teamID || ""}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    className="appearance-none px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg transition-colors cursor-pointer pr-8"
                  >
                    {user.teams.map((team) => (
                      <option key={team.teamID} value={team.teamID}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => setShowJoinTeamModal(true)}
                  className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Join Team
                </button>

                <button
                  onClick={toggleChat}
                  className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {showChat === "open" ? "Hide Chat" : "Team Chat"}
                </button>
              </div>

              <div className="my-3 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Team ID:
                </span>
                <span className="text-sm text-gray-600 font-mono flex-1 truncate">
                  {currentTeam?.teamID}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentTeam?.teamID);
                    toast.success("Copied!", alertObject);
                  }}
                  className="cursor-pointer p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative mr-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                        {member.username.charAt(0)}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          onlineMembers.some((u) => u.userID === member.userID)
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {member.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.role}
                      </p>
                    </div>

                    {user.role === "Team Head" &&
                      user.userID !== member.userID && (
                        <div className="flex items-center space-x-2 ml-3">
                          <button
                            onClick={() => handleRemoveMember(member.userID)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCloseTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Close Ticket
              </h3>
              <button
                onClick={() => setShowCloseTicketModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
              >
                <option value="">Select resolution type</option>
                <option value="solved">Solved</option>
                <option value="answered">Answered</option>
                <option value="no_response">No Response</option>
                <option value="duplicate">Duplicate</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any notes about the resolution..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={sendSurvey}
                  onChange={(e) => setSendSurvey(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send customer satisfaction survey
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCloseTicketModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseTicket}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketView;
