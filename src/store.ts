import { configureStore } from '@reduxjs/toolkit';
import problemsReducer from './problemsSlice';

export const store = configureStore({
  reducer: {
    problems: problemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
