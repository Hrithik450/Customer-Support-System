import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { alertObject } from "../../../pages/Home/collaboration";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/api/v1/auth/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
      },
    });

    localStorage.removeItem("AICS");
    localStorage.removeItem("isAuthenticated");
    toast.success(res?.data?.message, alertObject);
    return res?.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    toast.error(errorMessage, alertObject);
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const Oauth = createAsyncThunk(
  "oauth/cookie",
  async (userID, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/auth/set-cookie`,
        { userID },
        { withCredentials: true }
      );

      localStorage.setItem("AICS", JSON.stringify(response?.data?.user?.token));
      localStorage.setItem("isAuthenticated", "true");
      toast.success(response?.data?.message, alertObject);
      return response?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage, alertObject);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchprofile = createAsyncThunk(
  "fetch/profile",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
        },
      });

      return response?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchAgents = createAsyncThunk(
  "fetch/agents",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/auth/agents`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("AICS"))}`,
        },
      });

      return response?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
