import React from "react";
import { AvailabilityBadge } from "./status";

export const UserAvatar = ({ user, small = false }) => (
  <div className="relative">
    <div
      className={`${
        small ? "w-6 h-6" : "w-8 h-8"
      } rounded-full bg-indigo-100 flex items-center justify-center`}
    >
      <span
        className={`${
          small ? "text-xs" : "text-sm"
        } font-medium text-indigo-800`}
      >
        {user.username.charAt(0).toUpperCase()}
      </span>
    </div>
    {!small && (
      <div className="absolute -bottom-0.5 -right-0.5">
        <AvailabilityBadge status={user.status} />
      </div>
    )}
  </div>
);
