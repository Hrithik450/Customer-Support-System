import React from "react";

const DotSpinner = ({ size = "1em", color = "currentColor" }) => {
  return (
    <div className="flex justify-center items-center h-[20px] w-full">
      <div className="flex space-x-2">
        <div
          className="w-[0.5em] h-[0.5em] rounded-full animate-bounce"
          style={{
            backgroundColor: color,
            animationDelay: "0s",
            transform: `scale(${size})`,
          }}
        />
        <div
          className="w-[0.5em] h-[0.5em] rounded-full animate-bounce"
          style={{
            backgroundColor: color,
            animationDelay: "0.2s",
            transform: `scale(${size})`,
          }}
        />
        <div
          className="w-[0.5em] h-[0.5em] rounded-full animate-bounce"
          style={{
            backgroundColor: color,
            animationDelay: "0.4s",
            transform: `scale(${size})`,
          }}
        />
      </div>
    </div>
  );
};

export default DotSpinner;
