import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
