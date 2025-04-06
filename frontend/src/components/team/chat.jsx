import React, { useRef, useEffect } from "react";
import { DateTime } from "luxon";
import { UserAvatar } from "./avatar";

export const ChatWindow = ({
  messages,
  currentUser,
  newMessage,
  onMessageChange,
  onSendMessage,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Team Chat</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageItem key={index} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-r-lg text-white ${
              newMessage.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageItem = ({ message, currentUser }) => (
  <div
    className={`mb-4 flex ${
      message.sender === currentUser.userID ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
        message.sender === currentUser.userID ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <div className="flex items-center mb-1">
        {message.sender !== currentUser.userID && (
          <UserAvatar user={message} small />
        )}
        <span className="text-xs font-medium text-gray-600 ml-2">
          {message.sender === currentUser.userID ? "You" : message.name}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          {DateTime.fromMillis(message.timestamp).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        </span>
      </div>
      <p className="text-sm text-gray-800">{message.message}</p>
    </div>
  </div>
);
