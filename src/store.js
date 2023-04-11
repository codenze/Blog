import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import userReducer from './userSlice';
import commentReducer from './commentSlice';
import likeReducer from './likeSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    comment: commentReducer,
    like: likeReducer
  },
});

export default store;
