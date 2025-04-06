import React from "react";

export const AvailabilityBadge = ({ status }) => {
  const statusConfig = {
    Available: { color: "bg-green-100 text-green-800", label: "Available" },
    Busy: { color: "bg-yellow-100 text-yellow-800", label: "Busy" },
    Away: { color: "bg-gray-100 text-gray-800", label: "Away" },
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        statusConfig[status]?.color || "bg-gray-100"
      }`}
    >
      {statusConfig[status]?.label || "Unknown"}
    </span>
  );
};
