import React from "react";

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

const resolutionToolkit = [
  "Payment Troubleshooting Guide",
  "Subscription Management Workflow",
];

const MiddlePanel = ({ selectedTicket, setShowCloseTicketModal }) => {
  return (
    <div className="bg-white text-black p-4 border-r border-gray-200 overflow-y-auto shadow-sm">
      <div className="sticky top-0 bg-white py-2 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Conversation Thread
        </h2>
        {selectedTicket.status === "closed" ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Ticket Closed
          </span>
        ) : (
          <button
            onClick={() => setShowCloseTicketModal(true)}
            className="px-3 py-1 mb-4 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-full flex items-center"
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

        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <div className="flex justify-between items-center cursor-pointer">
            <h3 className="font-semibold text-blue-800">Summary</h3>
            <svg
              className="w-5 h-5 text-blue-500"
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
          <p className="text-sm text-gray-700 mt-2">
            {conversationThread.summary}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {conversationThread.messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.sender === "Customer"
                ? "bg-orange-50 border border-orange-100"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800">{message.sender}:</p>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
            <p className="mt-1 text-gray-700">
              {message.text.split(" ").map((word, wordIndex) =>
                message.keyPhrases.includes(word) ? (
                  <span key={wordIndex} className="bg-yellow-200 px-1 rounded">
                    {word}
                  </span>
                ) : (
                  <span key={wordIndex}> {word} </span>
                )
              )}
            </p>
          </div>
        ))}
      </div>

      {selectedTicket.status !== "closed" && (
        <div className="mt-6 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">
            Suggested Replies
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
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Resolution Toolkit</h3>
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
    </div>
  );
};

export default MiddlePanel;
