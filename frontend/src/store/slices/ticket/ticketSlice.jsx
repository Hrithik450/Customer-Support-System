import { createSlice } from "@reduxjs/toolkit";
import { fetchUserTickets } from "./ticketThunks";

const initialState = {
  tickets: [],
  ticketLoading: false,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTickets.pending, (state) => {
        state.ticketLoading = true;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.ticketLoading = false;
        state.tickets = action.payload?.agentTickets;
      })
      .addCase(fetchUserTickets.rejected, (state) => {
        state.ticketLoading = false;
      });
  },
});

export default ticketSlice.reducer;
