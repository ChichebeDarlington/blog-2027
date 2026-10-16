import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getErrorMessage } from '../../services/api';

export interface AdminUser { id: string; email: string; role: 'admin'; lastLoginAt?: string; }
interface AuthState { user: AdminUser | null; checking: boolean; loading: boolean; error: string | null; }
const initialState: AuthState = { user: null, checking: true, loading: false, error: null };

export const checkSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try { const response = await api.get('/auth/me'); return response.data.data.user as AdminUser; }
  catch (error) { return rejectWithValue(getErrorMessage(error, 'Not signed in.')); }
});
export const loginAdmin = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }, { rejectWithValue }) => {
  try { const response = await api.post('/auth/login', credentials); return response.data.data.user as AdminUser; }
  catch (error) { return rejectWithValue(getErrorMessage(error, 'Unable to sign in.')); }
});
export const logoutAdmin = createAsyncThunk('auth/logout', async () => { await api.post('/auth/logout'); });

const authSlice = createSlice({
  name: 'auth', initialState, reducers: { clearAuthError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder.addCase(checkSession.pending, (state) => { state.checking = true; });
    builder.addCase(checkSession.fulfilled, (state, action) => { state.checking = false; state.user = action.payload; });
    builder.addCase(checkSession.rejected, (state) => { state.checking = false; state.user = null; });
    builder.addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginAdmin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; });
    builder.addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Login failed.'); });
    builder.addCase(logoutAdmin.fulfilled, (state) => { state.user = null; state.error = null; });
  }
});
export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
