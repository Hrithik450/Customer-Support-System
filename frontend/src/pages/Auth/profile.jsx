import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchprofile, logout } from "../../store/slices/auth/authThunks";
import DotSpinner from "../../components/common/dotSpinner";

const Profile = ({ toggleAcc, isOpen }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authLoading, user } = useSelector((state) => state.authReducer);
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
    const fetchProfile = async () => {
      await dispatch(fetchprofile()).unwrap();
    };
    fetchProfile();
  }, [dispatch]);

  const onLogout = async () => {
    const response = await dispatch(logout()).unwrap();
    if (response?.success) setSearchParams({});
  };

  if (authLoading) {
    return (
      <div
        ref={smoothRef}
        style={{ transform: "translateX(100%)" }}
        className="fixed top-0 right-0 z-[101] min-h-screen max-h-screen max-w-[450px] w-full overflow-hidden overflow-y-auto p-6 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border-l border-gray-200 shadow-xl text-gray-800 animate-slideIn max-md:max-w-full max-sm:max-w-full sm:w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            Agent Profile
          </h2>
          <button
            onClick={toggleAcc}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors duration-300"
          >
            ✕
          </button>
        </div>

        <DotSpinner />
      </div>
    );
  }

  return (
    <div
      ref={smoothRef}
      style={{ transform: "translateX(100%)" }}
      className="fixed top-0 right-0 z-[101] min-h-screen max-h-screen max-w-[450px] w-full overflow-hidden overflow-y-auto p-6 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border-l border-gray-200 shadow-xl text-gray-800 animate-slideIn max-md:max-w-full max-sm:max-w-full sm:w-full"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
          Agent Profile
        </h2>
        <button
          onClick={toggleAcc}
          className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors duration-300"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img
              src={user?.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
            Active
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Hruthik M</h3>
        <p className="text-gray-600">Senior Support Agent</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-blue-600"
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
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-xl font-bold text-gray-800">142</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <svg
                className="w-5 h-5 text-purple-600"
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
            <div>
              <p className="text-sm text-gray-500">Avg. Time</p>
              <p className="text-xl font-bold text-gray-800">24m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Employee ID</p>
            <p className="text-gray-800">{user?.userID}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Active</p>
            <p className="text-gray-800">{user?.lastActive}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Performance Metrics
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Customer Satisfaction
              </span>
              <span className="text-sm font-medium text-gray-700">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                First Contact Resolution
              </span>
              <span className="text-sm font-medium text-gray-700">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
