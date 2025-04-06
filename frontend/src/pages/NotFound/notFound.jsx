import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center p-6">
      <img
        src="https://res.cloudinary.com/duozomapm/image/upload/v1739505711/ErrorImage_xydo7l.png"
        alt="404 Error"
        className="mb-6 max-w-lg w-full"
      />
      <h1 className="text-7xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-lg bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
