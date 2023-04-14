import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import postReducer from '../slices/postSlice';
import userReducer from '../slices/userSlice';
import commentReducer from '../slices/commentSlice';
import likeReducer from '../slices/likeSlice';
import notificationReducer from '../slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    comment: commentReducer,
    like: likeReducer,
    notification: notificationReducer
  },
});

export default store;
