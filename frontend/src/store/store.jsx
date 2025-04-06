import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import teamReducer from "./slices/team/teamSlice";
import ticketReducer from "./slices/ticket/ticketSlice";

const store = configureStore({
  reducer: {
    authReducer: authReducer,
    teamReducer: teamReducer,
    ticketReducer: ticketReducer,
  },
});

export default store;
