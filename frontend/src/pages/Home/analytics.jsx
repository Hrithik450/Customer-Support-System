import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { scaleOrdinal } from "@visx/scale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = {
  primary: "#6366f1",
  secondary: "#10b981",
  accent: "#f59e0b",
  danger: "#ef4444",
  gray: "#6b7280",
};

const data = {
  resolutionTime: [
    { month: "Jan", avgTime: 65 },
    { month: "Feb", avgTime: 59 },
    { month: "Mar", avgTime: 68 },
    { month: "Apr", avgTime: 62 },
    { month: "May", avgTime: 58 },
    { month: "Jun", avgTime: 64 },
  ],
  knowledgeGaps: [
    { topic: "Payment Issues", count: 45 },
    { topic: "Login Problems", count: 30 },
    { topic: "Shipping Delays", count: 15 },
    { topic: "Account Settings", count: 10 },
  ],
  agentPerformance: [
    { agent: "Alice", resolved: 120, avgResolution: 55 },
    { agent: "Bob", resolved: 95, avgResolution: 70 },
    { agent: "Charlie", resolved: 110, avgResolution: 60 },
  ],
  satisfaction: [
    { resolutionTime: "<15m", satisfaction: 0.95 },
    { resolutionTime: "15-30m", satisfaction: 0.85 },
    { resolutionTime: "30-60m", satisfaction: 0.7 },
    { resolutionTime: ">60m", satisfaction: 0.55 },
  ],
};

const satisfactionColorScale = scaleOrdinal({
  domain: data.satisfaction.map((d) => d.resolutionTime),
  range: [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger],
});

function AnalyticsHub() {
  const resolutionTimeData = {
    labels: data.resolutionTime.map((item) => item.month),
    datasets: [
      {
        label: "Avg. Resolution Time (mins)",
        data: data.resolutionTime.map((item) => item.avgTime),
        fill: false,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const resolutionTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Avg. Resolution Time (mins)",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Avg: ${context.parsed.y} mins`,
        },
      },
    },
  };

  const knowledgeGapsData = {
    labels: data.knowledgeGaps.map((item) => item.topic),
    datasets: [
      {
        label: "Number of Tickets",
        data: data.knowledgeGaps.map((item) => item.count),
        backgroundColor: COLORS.secondary,
      },
    ],
  };

  const knowledgeGapsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Tickets",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
      x: {
        title: {
          display: true,
          text: "Topic",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Tickets: ${context.parsed.y}`,
        },
      },
    },
  };

  const agentPerformanceData = {
    labels: data.agentPerformance.map((item) => item.agent),
    datasets: [
      {
        label: "Tickets Resolved",
        data: data.agentPerformance.map((item) => item.resolved),
        backgroundColor: COLORS.primary,
      },
      {
        label: "Avg. Resolution Time (mins)",
        data: data.agentPerformance.map((item) => item.avgResolution),
        backgroundColor: COLORS.accent,
      },
    ],
  };

  const agentPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
      x: {
        title: {
          display: true,
          text: "Agent",
          color: COLORS.gray,
        },
        ticks: {
          color: COLORS.gray,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
  };

  const satisfactionData = {
    labels: data.satisfaction.map((item) => item.resolutionTime),
    datasets: [
      {
        label: "Satisfaction",
        data: data.satisfaction.map((item) => item.satisfaction),
        backgroundColor: data.satisfaction.map((item) =>
          satisfactionColorScale(item.resolutionTime)
        ),
        hoverOffset: 4,
      },
    ],
  };

  const satisfactionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Satisfaction: ${(context.parsed * 100).toFixed(2)}%`,
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Analytics Hub
        </h2>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Last Updated: Today
          </span>
          <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Resolution Time Trends
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              Monthly Average
            </span>
          </div>
        </div>
        <div className="h-[300px]">
          <Line data={resolutionTimeData} options={resolutionTimeOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Knowledge Gap Identification
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
              Top Issues
            </span>
          </div>
        </div>
        <div className="h-[300px]">
          <Bar data={knowledgeGapsData} options={knowledgeGapsOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Agent Performance
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
              Last 30 Days
            </span>
          </div>
        </div>
        <div className="h-[300px]">
          <Bar data={agentPerformanceData} options={agentPerformanceOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Satisfaction Correlation
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
              Key Metric
            </span>
          </div>
        </div>
        <div className="h-[300px] relative">
          <Pie data={satisfactionData} options={satisfactionOptions} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsHub;
