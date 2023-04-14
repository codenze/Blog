import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: false,
  message:'',
  isSuccess: false
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload.notification;
      state.message = action.payload.message;
      state.isSuccess = action.payload.isSuccess;
    },
  }
});


export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
