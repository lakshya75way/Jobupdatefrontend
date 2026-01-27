import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../../types/job";

interface JobState {
  jobs: Job[];
  loading: boolean;
  lastFetched: number | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  lastFetched: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.loading = false;
      state.lastFetched = Date.now();
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((j) => j.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      } else {
        state.jobs.unshift(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setJobs, updateJob, setLoading } = jobSlice.actions;
export default jobSlice.reducer;
