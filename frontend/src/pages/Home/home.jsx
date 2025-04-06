import React, { useEffect, useState } from "react";

const queueMetrics = {
  waitingTickets: 15,
  avgWaitTime: "5m 30s",
};

const personalWorkload = {
  openTickets: 10,
  overdueTickets: 2,
};

const urgentTickets = [
  { id: 1, title: "Server Down - Urgent", priority: "High" },
  { id: 2, title: "Payment Gateway Error", priority: "High" },
  { id: 3, title: "Login Issues", priority: "Medium" },
];

const performanceInsights = {
  yourResolutionTime: "1h 15m",
  teamAvgResolutionTime: "1h 30m",
};

const aiQuickActions = [
  { id: 1, label: "Common Response: Password Reset" },
  { id: 2, label: "Knowledge Lookup: API Documentation" },
  { id: 3, label: "Common Response: Order Status" },
];

const Dashboard = () => {
  const [currentUrgentTicket, setCurrentUrgentTicket] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUrgentTicket((prev) => (prev + 1) % urgentTickets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Queue Metrics</h2>
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-indigo-100">Tickets Waiting</p>
              <p className="text-3xl font-bold">
                {queueMetrics.waitingTickets}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-100">Avg. Wait Time</p>
              <p className="text-3xl font-bold">{queueMetrics.avgWaitTime}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-indigo-400 rounded-full">
            <div
              className="h-2 bg-white rounded-full"
              style={{
                width: `${Math.min(queueMetrics.waitingTickets * 5, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Personal Workload</h2>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-cyan-100">Open Tickets</p>
              <p className="text-3xl font-bold">
                {personalWorkload.openTickets}
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-100">Overdue Tickets</p>
              <p className="text-3xl font-bold animate-pulse">
                {personalWorkload.overdueTickets}
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            {[...Array(personalWorkload.openTickets)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full ${
                  i < personalWorkload.overdueTickets
                    ? "bg-red-300"
                    : "bg-cyan-300"
                }`}
                style={{ width: "20%" }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Urgent Tickets</h2>
            <svg
              className="w-6 h-6 animate-pulse"
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
          </div>
          <div className="p-4 bg-red-400/30 rounded-lg border border-red-300">
            <p className="font-bold text-lg">
              {urgentTickets[currentUrgentTicket].title}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  urgentTickets[currentUrgentTicket].priority === "High"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {urgentTickets[currentUrgentTicket].priority} PRIORITY
              </span>
              <span className="text-sm">
                {urgentTickets[currentUrgentTicket].waitTime} waiting
              </span>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {urgentTickets.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentUrgentTicket(i)}
                className={`w-2 h-2 rounded-full ${
                  i === currentUrgentTicket ? "bg-white" : "bg-red-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Performance Insights</h2>
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Resolution</span>
                <span>{performanceInsights.yourResolutionTime}</span>
              </div>
              <div className="h-3 bg-emerald-400 rounded-full">
                <div
                  className="h-3 bg-white rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Team Average</span>
                <span>{performanceInsights.teamAvgResolutionTime}</span>
              </div>
              <div className="h-3 bg-emerald-400 rounded-full">
                <div
                  className="h-3 bg-yellow-200 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            {performanceInsights.yourResolutionTime <
            performanceInsights.teamAvgResolutionTime ? (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                🏆 You're outperforming the team!
              </span>
            ) : (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                💪 Keep going, you're getting better!
              </span>
            )}
          </div>
        </div>

        <div className="bg-white text-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI Quick Actions</h2>
            <svg
              className="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {aiQuickActions.map((action) => (
              <button
                key={action.id}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:from-purple-100 hover:to-indigo-100 border border-purple-100 transition-all duration-200 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full mr-2 group-hover:bg-purple-200">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={action.iconPath}
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
