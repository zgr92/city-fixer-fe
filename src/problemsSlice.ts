import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Problem from './Types/ProblemInterface';
import client from './client';
import ProblemsState from './Types/ProblemsStateInterface';


const initialState = {
  problems: [],
  status: 'idle',
  error: null,
} as ProblemsState;

export const fetchProblems = createAsyncThunk('problems/fetchProblems', async () => (await client.get('/api/problems/')) as Problem[]);

export const saveProblem = createAsyncThunk('problems/saveProblem', async (formData: Problem) => (await client.post('/api/problems/', JSON.stringify(formData))) as Problem[]);

const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProblems.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchProblems.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.problems = action.payload;
    });
    builder.addCase(fetchProblems.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(saveProblem.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(saveProblem.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.problems = action.payload;
    });
    builder.addCase(saveProblem.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export const selectAllProblems = (state: { problems: ProblemsState }): Problem[] => state.problems.problems;

export default problemsSlice.reducer;
