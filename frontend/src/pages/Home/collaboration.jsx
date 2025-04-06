import React, { useState } from "react";
import { toast } from "react-toastify";

export const alertObject = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

function AICollaboration() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [riskyLanguage, setRiskyLanguage] = useState([]);
  const commonPhrases = [
    "Thank you for your patience.",
    "I understand your concern.",
    "Let me check that for you.",
    "Please provide your account number.",
  ];

  const complianceCheck = (text) => {
    const riskyKeywords = ["urgent", "immediately", "guarantee", "promise"];
    const foundKeywords = [];
    riskyKeywords.forEach((keyword) => {
      if (text.toLowerCase().includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
    setRiskyLanguage(foundKeywords);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    complianceCheck(text);
  };

  const handleToneChange = (e) => {
    setTone(e.target.value);
  };

  const handlePhraseClick = (phrase) => {
    setMessage((prevMessage) => prevMessage + " " + phrase);
    complianceCheck(message + " " + phrase);
  };

  const handleSummarize = () => {
    toast.success("Simulating: Summarizing the thread...", alertObject);
  };

  const handleFindSimilar = () => {
    toast.success("Simulating: Finding similar cases...", alertObject);
  };

  const handleSuggestResolution = () => {
    toast.success("Simulating: Suggesting resolution...", alertObject);
  };

  const handleEstimateTime = () => {
    toast.success("Simulating: Estimating resolution time...", alertObject);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          AI Collaboration Features
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            AI Assistant Active
          </span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="smartComposer"
            className="block text-sm font-medium text-gray-700"
          >
            Smart Message Composer
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">AI Confidence: 92%</span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="smartComposer"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows="5"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message here and let AI help you craft the perfect response..."
          />

          {riskyLanguage.length > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs animate-pulse">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Risky language detected: {riskyLanguage.join(", ")}
            </div>
          )}

          <div className="absolute top-3 right-3 flex space-x-1">
            <button className="p-1 text-gray-400 hover:text-blue-500">
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-blue-500">
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
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message Tone
            </label>
            <div className="relative">
              <select
                id="tone"
                className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={tone}
                onChange={handleToneChange}
              >
                <option value="professional">Professional</option>
                <option value="empathetic">Empathetic</option>
                <option value="technical">Technical</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quick Insert
            </label>
            <div className="flex flex-wrap gap-2">
              {commonPhrases.map((phrase, index) => (
                <button
                  key={index}
                  className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-600 py-1 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center"
                  onClick={() => handlePhraseClick(phrase)}
                >
                  <svg
                    className="w-3 h-3 mr-1"
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
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          AI-Powered Actions
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className="group relative overflow-hidden bg-white border border-blue-100 hover:border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
            onClick={handleSummarize}
          >
            <div className="absolute top-0 right-0 p-2 bg-blue-50 rounded-bl-xl rounded-tr-xl">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Summarize Thread
            </h3>
            <p className="text-xs text-gray-500">
              Generate concise summary of conversation
            </p>
          </button>

          <button
            className="group relative overflow-hidden bg-white border border-green-100 hover:border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
            onClick={handleFindSimilar}
          >
            <div className="absolute top-0 right-0 p-2 bg-green-50 rounded-bl-xl rounded-tr-xl">
              <svg
                className="w-5 h-5 text-green-500"
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
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Find Similar Cases
            </h3>
            <p className="text-xs text-gray-500">
              Search knowledge base for related tickets
            </p>
          </button>

          <button
            className="group relative overflow-hidden bg-white border border-yellow-100 hover:border-yellow-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
            onClick={handleSuggestResolution}
          >
            <div className="absolute top-0 right-0 p-2 bg-yellow-50 rounded-bl-xl rounded-tr-xl">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Suggest Resolution
            </h3>
            <p className="text-xs text-gray-500">
              Get AI-recommended solutions
            </p>
          </button>

          <button
            className="group relative overflow-hidden bg-white border border-purple-100 hover:border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
            onClick={handleEstimateTime}
          >
            <div className="absolute top-0 right-0 p-2 bg-purple-50 rounded-bl-xl rounded-tr-xl">
              <svg
                className="w-5 h-5 text-purple-500"
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
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Estimate Resolution
            </h3>
            <p className="text-xs text-gray-500">
              Predict time needed to resolve
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AICollaboration;
