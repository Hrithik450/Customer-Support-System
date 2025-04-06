import React, { useState } from "react";

const customerProfile = {
  name: "John Doe",
  history: "3 previous tickets",
  valueTier: "Gold",
  preferences: "Email updates",
};

const LeftPanel = ({ ticketQueue, selectedTicket }) => {
  return (
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
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

      <div className="space-y-2 max-h-[340px] overflow-y-auto">
        {ticketQueue.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-3 rounded-lg transition-all duration-200 cursor-pointer border ${
              selectedTicket.id === ticket.id
                ? "border-blue-400 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 truncate">
                {ticket.title}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
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
                    ticket.sentiment === "Positive"
                      ? "bg-green-500"
                      : ticket.sentiment === "Negative"
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
                {ticket.resolutionTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 my-4 border border-gray-200">
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
    </div>
  );
};

export default LeftPanel;
