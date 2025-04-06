import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { alertObject } from "../collaboration";
import {
  addWorkflow,
  deleteWorkflow,
  fetchRules,
  reorderWorkflow,
  updateWorkflow,
} from "../../../store/slices/team/teamThunks";
import CircularLoader from "../../../components/common/cirSpinner";

const conditionOptions = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
];
const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-purple-500", label: "Purple" },
];
const actionOptions = [{ value: "route_to", label: "Route to Team" }];

const WorkflowRules = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [newRule, setNewRule] = useState({
    trigger: "",
    condition: "contains",
    value: "",
    action: "route_to",
    routeTeam: "",
    color: "bg-blue-500",
  });

  const { teams, rules, workflowLoading } = useSelector(
    (state) => state.teamReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchRules()).unwrap();
      } catch (error) {
        console.log(error);
        toast.error("Failed to load workflow rules", alertObject);
      }
    };
    fetchData();
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
  };

  const handleDrop = async (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const updatedRules = [...rules];
    const [movedRule] = updatedRules.splice(draggedItem, 1);
    updatedRules.splice(index, 0, movedRule);

    await dispatch(reorderWorkflow({ rules: updatedRules })).unwrap();
    setHoverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setHoverIndex(null);
  };

  const handleAddRule = async () => {
    setShowAddModal(false);
    setNewRule({
      trigger: "",
      condition: "contains",
      value: "",
      action: "route_to",
      routeTeam: "",
      color: "bg-blue-500",
    });
    await dispatch(addWorkflow({ newRule })).unwrap();
  };

  const handleEditRule = async () => {
    setShowEditModal(false);
    await dispatch(updateWorkflow({ updateRule: currentRule })).unwrap();
  };

  const handleDeleteRule = async (id) => {
    if (!id) return toast.error("Please provide the ID", alertObject);
    await dispatch(deleteWorkflow({ id })).unwrap();
  };

  const openEditModal = (rule) => {
    setCurrentRule(rule);
    setShowEditModal(true);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Workflow Rules</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center cursor-pointer"
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
          Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {workflowLoading ? (
          <CircularLoader color={"gray"} />
        ) : (
          rules.map((rule, index) => (
            <div
              key={rule.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative p-4 rounded-lg border transition-all duration-200 cursor-move ${
                draggedItem === index
                  ? "border-dashed border-blue-400 bg-blue-50 scale-[0.98]"
                  : hoverIndex === index
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-white"
              } ${
                hoverIndex === index &&
                draggedItem !== null &&
                draggedItem !== index
                  ? "shadow-md"
                  : "shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${rule.color}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      <span className="text-gray-500">When</span> {rule.trigger}{" "}
                      {rule.condition} "{rule.value}"
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-500">Then</span>{" "}
                      {rule.action === "route_to"
                        ? `Route to ${rule.routeTeam}`
                        : "Perform custom action"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(rule)}
                    className="p-1 text-gray-400 hover:text-blue-600"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
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
              {hoverIndex === index &&
                draggedItem !== null &&
                draggedItem !== index && (
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none"></div>
                )}
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Drag and drop rules to reorder priority. Higher rules take precedence.
      </p>

      {showAddModal && (
        <RuleModal
          title="Add Workflow Rule"
          rule={newRule}
          setRule={setNewRule}
          teams={teams}
          onSave={handleAddRule}
          onClose={() => setShowAddModal(false)}
          loading={workflowLoading}
        />
      )}

      {showEditModal && (
        <RuleModal
          title="Edit Workflow Rule"
          rule={currentRule}
          setRule={setCurrentRule}
          teams={teams}
          onSave={handleEditRule}
          onClose={() => setShowEditModal(false)}
          loading={workflowLoading}
        />
      )}
    </div>
  );
};

const RuleModal = ({
  title,
  rule,
  setRule,
  teams,
  onSave,
  onClose,
  loading,
}) => {
  const triggerOptions = [
    { value: "category", label: "Category" },
    { value: "messages", label: "Messages" },
    { value: "priority", label: "Priority" },
    { value: "sentiment", label: "Sentiment" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              When
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                value={rule.trigger}
                onChange={(e) => setRule({ ...rule, trigger: e.target.value })}
              >
                <option value="">Select Field</option>
                {triggerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                className="col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                value={rule.condition}
                onChange={(e) =>
                  setRule({ ...rule, condition: e.target.value })
                }
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                value={rule.value}
                onChange={(e) => setRule({ ...rule, value: e.target.value })}
                placeholder="Value"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Then
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                value={rule.action}
                onChange={(e) => setRule({ ...rule, action: e.target.value })}
              >
                {actionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {rule.action === "route_to" && (
                <select
                  className="col-span-1 px-3 py-2 border border-gray-300 rounded-md"
                  value={rule.routeTeam}
                  onChange={(e) =>
                    setRule({ ...rule, routeTeam: e.target.value })
                  }
                >
                  <option value="">Select Team</option>
                  {teams.map((team, tidx) => (
                    <option key={`team-${tidx}`} value={team.teamName}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Indicator
            </label>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    color.value
                  } ${
                    rule.color === color.value
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  onClick={() => setRule({ ...rule, color: color.value })}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={
              !rule.trigger ||
              !rule.value ||
              (rule.action === "route_to" && !rule.routeTeam)
            }
            className={`px-4 py-2 text-white rounded-md cursor-pointer ${
              !rule.trigger ||
              !rule.value ||
              (rule.action === "route_to" && !rule.routeTeam)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? <CircularLoader /> : "Save Rule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRules;
