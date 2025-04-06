import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { alertObject } from "../../../pages/Home/collaboration";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchTeams = createAsyncThunk(
  "fetch/teams",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/team/getTeams`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
        },
      });

      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addTeam = createAsyncThunk(
  "add/team",
  async ({ teamName, teamCapacity }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/team/addTeam`,
        { teamName, teamCapacity },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "delete/team",
  async ({ teamID }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/team/deleteTeam/${teamID}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchRules = createAsyncThunk(
  "fetch/rules",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/team/getworkflows`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
        },
      });

      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addWorkflow = createAsyncThunk(
  "add/workflow",
  async ({ newRule }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/team/createworkflow`,
        newRule,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  "update/workflow",
  async ({ updateRule }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/v1/team/updateworkflow`,
        updateRule,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const reorderWorkflow = createAsyncThunk(
  "reorder/workflow",
  async ({ rules }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/v1/team/reorderworkflow`,
        { rules },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteWorkflow = createAsyncThunk(
  "delete/workflow",
  async ({ id }, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/team/deleteworkflow/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      toast.success(res?.data?.message, alertObject);
      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchTeamChats = createAsyncThunk(
  "fetch/chats",
  async ({ teamID }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/team/teamChats/${teamID}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchTeamMembers = createAsyncThunk(
  "fetch/members",
  async ({ teamID }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/team/teamMembers/${teamID}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
          },
        }
      );

      return res?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
