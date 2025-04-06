import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { alertObject } from "../../../pages/Home/collaboration";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchUserTickets = createAsyncThunk(
  "fetch/tickets",
  async ({ userID }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/ticket/fetchTickets/${userID}`,
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
