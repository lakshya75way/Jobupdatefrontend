import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "failed";
  error?: string;
  backendId?: string;
  file?: File; 
}

interface UploadState {
  items: UploadItem[];
  isExpanded: boolean;
}

const initialState: UploadState = {
  items: [],
  isExpanded: true,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<UploadItem>) => {
      state.items.unshift(action.payload);
      state.isExpanded = true;
    },
    updateProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>,
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.progress = action.payload.progress;
      }
    },
    updateStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "uploading" | "completed" | "failed";
        error?: string;
        backendId?: string;
      }>,
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.status = action.payload.status;
        item.error = action.payload.error;
        if (action.payload.backendId) {
          item.backendId = action.payload.backendId;
        }
      }
    },
    toggleTray: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((i) => i.status !== "completed");
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    resetUploads: (state) => {
      state.items = [];
      state.isExpanded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", (state) => {
      state.items = [];
      state.isExpanded = true;
    });
  },
});

export const {
  addUpload,
  updateProgress,
  updateStatus,
  toggleTray,
  clearCompleted,
  removeUpload,
  resetUploads,
} = uploadSlice.actions;

export default uploadSlice.reducer;
