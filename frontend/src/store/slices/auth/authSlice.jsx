import { createSlice } from "@reduxjs/toolkit";
import { fetchAgents, fetchprofile, logout, Oauth } from "./authThunks";

const agent = {
  avgResolutionTime: 10,
  createdAt: "2025-04-04 23:08:24",
  email: "mhrithik450@gmail.com",
  image:
    "https://lh3.googleusercontent.com/a/ACg8ocKroOwYzIxP-E62qvZatqcvO0JRObejVniEoXYhdKg-q05Y7R3X=s96-c",
  lastActive: "2025-04-04 23:08:24",
  role: "Team Head",
  satisfactionScore: 4.8,
  teamID: "pddcRqwXYbT0Z39yIinv",
  teams: [
    {
      teamID: "pddcRqwXYbT0Z39yIinv",
      teamName: "Technical Support",
    },
    {
      teamID: "gpOw2HoyMSCbQOrmLNAs",
      teamName: "Product Specialist",
    },
  ],
  userID: "118133313152586309450",
  username: "Hruthik M",
  workload: 4,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    authLoading: false,
    user: agent,
    users: null,
    teamUsers: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state) => {
      state.authLoading = true;
    };

    const setError = (state) => {
      state.authLoading = false;
    };

    const setUserAuth = (state, action) => {
      state.authLoading = false;
      state.user = action.payload?.user || null;
    };

    builder
      .addCase(Oauth.pending, setLoading)
      .addCase(Oauth.fulfilled, setUserAuth)
      .addCase(Oauth.rejected, setError)
      .addCase(fetchprofile.pending, setLoading)
      .addCase(fetchprofile.fulfilled, setUserAuth)
      .addCase(fetchprofile.rejected, setError)
      .addCase(logout.pending, setLoading)
      .addCase(logout.fulfilled, setUserAuth)
      .addCase(logout.rejected, setError)
      .addCase(fetchAgents.pending, setLoading)
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.authLoading = false;
        state.users = action.payload.agents;
      })
      .addCase(fetchAgents.rejected, setError);
  },
});

export default authSlice.reducer;
