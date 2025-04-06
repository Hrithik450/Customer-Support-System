import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  addTeam,
  addWorkflow,
  deleteTeam,
  deleteWorkflow,
  fetchRules,
  fetchTeamChats,
  fetchTeamMembers,
  fetchTeams,
  reorderWorkflow,
  updateWorkflow,
} from "./teamThunks";

const initialState = {
  onlineMembers: [],
  members: [],
  messages: [],
  teams: [],
  rules: [],
  currentTeam: {},
  teamLoading: false,
  workflowLoading: false,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setOnlineMembers: (state, action) => {
      state.onlineMembers = action.payload;
    },
    setTeamMembers: (state, action) => {
      state.members = action.payload;
    },
    addTeamMember: (state, action) => {
      if (!state.members.some((m) => m.userID === action.payload.userID)) {
        state.members.push(action.payload);
      }
    },
    removeTeamMember: (state, action) => {
      state.members = state.members.filter((m) => m.userID !== action.payload);
    },
    sendChatMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    loadPreviousMessages: (state, action) => {
      state.messages = action.payload;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    updateMemberStatus: (state, action) => {
      const member = state.members.find(
        (m) => m.userID === action.payload.userID
      );
      if (member) {
        member.status = action.payload.status;
        member.lastActive = action.payload.timestamp;
      }
    },
  },
  extraReducers: (builder) => {
    const setTeamLoading = (state) => {
      state.teamLoading = true;
    };

    const disTeamLoading = (state) => {
      state.teamLoading = false;
    };

    const setWorkLoading = (state) => {
      state.workflowLoading = true;
    };

    const disWorkLoading = (state) => {
      state.workflowLoading = false;
    };

    const setRules = (state, action) => {
      state.workflowLoading = false;
      state.rules = action.payload?.rules;
    };

    const setTeams = (state, action) => {
      state.teamLoading = false;
      state.teams = action.payload?.teams;
    };

    builder
      .addCase(fetchTeams.pending, setTeamLoading)
      .addCase(fetchTeams.fulfilled, setTeams)
      .addCase(fetchTeams.rejected, disTeamLoading)
      .addCase(addTeam.pending, setTeamLoading)
      .addCase(addTeam.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.teams.push(action.payload?.team);
      })
      .addCase(addTeam.rejected, disTeamLoading)
      .addCase(deleteTeam.pending, setTeamLoading)
      .addCase(deleteTeam.fulfilled, setTeams)
      .addCase(deleteTeam.rejected, disTeamLoading)
      .addCase(fetchRules.pending, setWorkLoading)
      .addCase(fetchRules.fulfilled, setRules)
      .addCase(fetchRules.rejected, disWorkLoading)
      .addCase(addWorkflow.pending, setWorkLoading)
      .addCase(addWorkflow.fulfilled, (state, action) => {
        state.workflowLoading = false;
        state.rules.push(action.payload?.rule);
      })
      .addCase(addWorkflow.rejected, disWorkLoading)
      .addCase(updateWorkflow.pending, setWorkLoading)
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.workflowLoading = false;
        if (action.payload?.rule?.id) {
          state.rules = state.rules.map((rule) =>
            rule.id === action.payload.rule.id ? action.payload.rule : rule
          );
        }
      })
      .addCase(updateWorkflow.rejected, disWorkLoading)
      .addCase(reorderWorkflow.pending, setWorkLoading)
      .addCase(reorderWorkflow.fulfilled, setRules)
      .addCase(reorderWorkflow.rejected, disWorkLoading)
      .addCase(deleteWorkflow.pending, setWorkLoading)
      .addCase(deleteWorkflow.fulfilled, setRules)
      .addCase(deleteWorkflow.rejected, disWorkLoading)
      .addCase(fetchTeamChats.pending, setTeamLoading)
      .addCase(fetchTeamChats.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.messages = action.payload?.chats;
      })
      .addCase(fetchTeamMembers.pending, setTeamLoading)
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.teamLoading = false;
        state.members = action.payload?.members;
      })
      .addCase(fetchTeamMembers.rejected, disTeamLoading);
  },
});

export const {
  setTeamMembers,
  addTeamMember,
  removeTeamMember,
  sendChatMessage,
  loadPreviousMessages,
  updateMemberStatus,
  setOnlineMembers,
  setCurrentTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
