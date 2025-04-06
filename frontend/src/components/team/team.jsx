import React from "react";
import { AvailabilityBadge } from "./status";
import { UserAvatar } from "./avatar";

export const TeamMemberList = ({ members, onRemoveMember }) => (
  <div className="space-y-3">
    {members.map((member) => (
      <div
        key={member.userID}
        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
      >
        <UserAvatar user={member} />

        <div className="flex-1 min-w-0 ml-3">
          <p className="text-sm font-medium text-gray-800 truncate">
            {member.username}
          </p>
          <p className="text-xs text-gray-500 truncate">{member.role}</p>
        </div>

        <div className="flex items-center space-x-2 ml-3">
          <AvailabilityBadge status={member.status} />
          <button
            onClick={() => onRemoveMember(member.userID)}
            className="ml-3 p-1 text-gray-400 hover:text-red-500"
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
      </div>
    ))}
  </div>
);
