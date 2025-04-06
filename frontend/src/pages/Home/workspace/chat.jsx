import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Socket from "../socket";

const Chat = ({ toggleChat, isOpen }) => {
  const [newMessage, setNewMessage] = useState("");
  const smoothRef = useRef(null);

  const { user } = useSelector((state) => state.authReducer);
  const { currentTeam, messages, onlineMembers } = useSelector(
    (state) => state.teamReducer
  );

  useEffect(() => {
    if (isOpen && smoothRef.current) {
      smoothRef.current.style.transform = "translateX(100%)";
      smoothRef.current.style.transition = "transform 0.3s ease-in-out";
      requestAnimationFrame(() => {
        smoothRef.current.style.transform = "translateX(0)";
      });
    } else if (smoothRef.current) {
      smoothRef.current.style.transition = "transform 0.3s ease-in-out";
      smoothRef.current.style.transform = "translateX(100%)";
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      name: user?.username,
      sender: user?.userID,
      message: newMessage,
      timestamp: new Date(),
    };

    Socket.emit("sendMessage", { teamID: currentTeam?.teamID, message });
    setNewMessage("");
  };

  return (
    <div
      ref={smoothRef}
      style={{ transform: "translateX(100%)" }}
      className="fixed top-0 right-0 z-[101] min-h-screen max-h-screen max-w-[450px] w-full overflow-hidden flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border-l border-gray-200 shadow-xl text-gray-800 animate-slideIn max-md:max-w-full max-sm:max-w-full sm:w-full"
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            Team Chat
          </h2>
          <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            {onlineMembers.length} Online
          </span>
        </div>
        <button
          onClick={toggleChat}
          className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors duration-300"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-12 h-12 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === user.userID ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  msg.sender === user.userID ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center mb-1">
                  {msg.sender !== user.userID && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-xs mr-2">
                      {msg.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-600">
                    {msg.sender === user.userID ? "You" : msg.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center">
          <button className="p-2 text-gray-500 hover:text-gray-700 mr-2">
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
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim()
                ? "text-blue-600 hover:text-blue-800"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
