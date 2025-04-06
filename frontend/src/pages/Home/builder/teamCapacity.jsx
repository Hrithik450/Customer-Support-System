import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeam,
  deleteTeam,
  fetchTeams,
} from "../../../store/slices/team/teamThunks";
import CircularLoader from "../../../components/common/cirSpinner";
import { alertObject } from "../collaboration";

const TeamCapacity = () => {
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    size: 10,
  });

  const { teams, teamLoading } = useSelector((state) => state.teamReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTeams()).unwrap();
    };
    fetchData();
  }, [dispatch]);

  const handleAddTeam = async () => {
    try {
      if (!newTeam.name.trim()) {
        return toast.error("Team name is required", alertObject);
      }

      const res = await dispatch(
        addTeam({ teamName: newTeam.name, teamCapacity: newTeam.size })
      ).unwrap();

      console.log(res);
      if (res?.success) {
        setShowAddTeamModal(false);
        setNewTeam({ name: "", size: 10 });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to create team",
        alertObject
      );
    }
  };

  const handleDeleteTeam = async (teamID) => {
    try {
      if (!teamID) return toast.error("Please provide teamID", alertObject);
      await dispatch(deleteTeam({ teamID })).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Team Capacity</h3>
        <button
          onClick={() => setShowAddTeamModal(true)}
          className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Team
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {teamLoading ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <CircularLoader color={"gray"} />
          </div>
        ) : (
          teams &&
          teams.map((team) => (
            <div
              key={team?.teamID}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">
                  {team?.teamName}
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      Number(team.teamMembers?.length || "0") > 7
                        ? "bg-green-100 text-green-800"
                        : Number(team.teamMembers?.length || "0") > 4
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {Number(team.teamMembers?.length || "0")}/
                    {team.teamCapacity}
                  </span>
                  <button
                    onClick={() => handleDeleteTeam(team.teamID)}
                    className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
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
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    Number(team.teamMembers?.length || "0") > 7
                      ? "bg-green-500"
                      : Number(team.teamMembers?.length || "0") > 4
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Number(team.teamMembers?.length || "0") * 10}%`,
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Team
              </h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                placeholder="Enter team name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Size
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newTeam.size}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, size: parseInt(e.target.value) })
                }
              >
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} members
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeam}
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                {teamLoading ? (
                  <div className="px-4">
                    <CircularLoader />
                  </div>
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCapacity;
