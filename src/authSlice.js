import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loginStatus: false,
  window: "Feed",
  query: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignOut: (state, action) => {
      state.currentUser = null;
      state.loginStatus = false;
    },
    setSignIn: (state, action) => {
      state.currentUser = action.payload;
      state.loginStatus = true;
    },
    setWindow: (state, action) => {
      state.window = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    }
  }
});

export const { setQuery, setCurrentUser, setWindow, setSignOut, setSignIn} = authSlice.actions;

export default authSlice.reducer;
