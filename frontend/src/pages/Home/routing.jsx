import { useState } from "react";
import TeamCapacity from "./builder/teamCapacity";
import WorkflowRules from "./builder/workflow";
import { useSelector } from "react-redux";
import CircularLoader from "../../components/common/cirSpinner";

const initialRoutingRules = [
  {
    id: "1",
    trigger: "Priority: High",
    action: "Route to Level 2 Support",
    color: "bg-red-200",
  },
  {
    id: "2",
    trigger: "Keyword: Billing",
    action: "Route to Billing Team",
    color: "bg-yellow-200",
  },
  {
    id: "3",
    trigger: "Product: Feature X",
    action: "Route to Feature X Experts",
    color: "bg-blue-200",
  },
];

const teamCapacity = {
  "Level 1 Support": 7,
  "Level 2 Support": 4,
  "Billing Team": 9,
  "Feature X Experts": 6,
};

const escalationPath = [
  "Initial Agent",
  "Level 1 Support",
  "Level 2 Support Manager",
  "Product Specialist",
];

function RoutingInterface() {
  const [routingRules, setRoutingRules] = useState(initialRoutingRules);
  const [teamCapacity, setTeamCapacity] = useState({ "Level 1 Team": 2 });

  const { rules, workflowLoading } = useSelector((state) => state.teamReducer);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Routing Interface
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Active Rules: {rules.length}
          </span>
        </div>
      </div>

      <WorkflowRules />

      <TeamCapacity
        teamCapacity={teamCapacity}
        setTeamCapacity={setTeamCapacity}
      />

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Escalation Path
        </h3>
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-4 min-w-max">
              {escalationPath.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-40 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{step}</p>
                  </div>
                  {index < escalationPath.length - 1 && (
                    <div className="absolute top-1/2 right-[-18px] transform -translate-y-1/2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            AI Recommendations
          </h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Active Learning
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Based on recent ticket patterns, I recommend adding this routing
                rule to improve efficiency:
              </p>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  If ticket contains "password reset" AND Level 1 capacity {">"}{" "}
                  6
                </p>
                <p className="text-xs text-gray-600">
                  Then route directly to Password Reset Specialists (predicted
                  to reduce resolution time by 23%)
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Implement Suggestion
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
              See Analysis
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoutingInterface;
