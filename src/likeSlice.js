import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likes: [],
  reports: []
};

export const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    setLikes: (state, action) => {
      state.likes = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    addReports: (state, action) => {
      const existingReport = state.reports.find(report => report.id === action.payload.id);
      if (!existingReport) {
        state.reports.push(action.payload);
     }
    }
  }
});


export const { addReports, setLikes, setReports } = likeSlice.actions;

export default likeSlice.reducer;
