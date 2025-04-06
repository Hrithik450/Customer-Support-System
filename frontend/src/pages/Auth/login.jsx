import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Oauth } from "../../store/slices/auth/authThunks";

const Auth = ({ toggleAuthen, isOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authLoading } = useSelector((state) => state.authReducer);
  const smoothRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && smoothRef.current) {
      smoothRef.current.style.transform = "translateX(100%)";
      smoothRef.current.style.transition = "transform 0.3s ease-in-out";
      requestAnimationFrame(() => {
        smoothRef.current.style.transform = "translateX(0)";
      });
    } else if (smoothRef.current) {
      smoothRef.current.style.transition = "transform 0.3s ease-in-out";
      smoothRef.current.style.transform = "translateX(100%)";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const userID = searchParams.get("tempToken");

      if (!userID) return;

      const res = await dispatch(Oauth(userID)).unwrap();
      if (res?.success) {
        setSearchParams({});
      }
    };

    handleOAuthSuccess();
  }, [dispatch]);

  return (
    <div
      ref={smoothRef}
      style={{ transform: "translateX(100%)" }}
      className="fixed top-0 right-0 z-[101] min-h-screen max-h-screen max-w-[450px] w-full overflow-hidden overflow-y-auto p-5 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border border-gray-200 shadow-xl text-gray-800 animate-slideIn max-md:max-w-full max-sm:max-w-full sm:w-full sm:p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
          Account
        </h2>
        <button
          onClick={toggleAuthen}
          className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors duration-300"
        >
          ✕
        </button>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full shadow-md">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to Customer Support System
          </h2>
          <p className="mt-2 text-gray-600">
            Continue with your Google account
          </p>
        </div>

        <div className="mb-6">
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`}
            className="flex items-center justify-center w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {authLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Authenticating...
              </div>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </a>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="text-center">
          <button
            // onClick={toggleAuthen}
            className="text-[#4f46e5] hover:text-[#7c3aed] transition-colors duration-300 font-medium cursor-pointer"
          >
            Continue as guest
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our <br />
            <a href="#" className="text-[#4f46e5] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#4f46e5] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
