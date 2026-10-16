import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getErrorMessage } from '../../services/api';
import { Post } from '../../types';

interface PostsState { items: Post[]; loading: boolean; error: string | null; page: number; totalPages: number; total: number; query: string; category: string; }
const initialState: PostsState = { items: [], loading: false, error: null, page: 1, totalPages: 1, total: 0, query: '', category: '' };

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (params: { page?: number; q?: string; category?: string } = {}, { rejectWithValue }) => {
  try {
    const response = await api.get('/posts', { params: { page: params.page || 1, limit: 9, q: params.q || '', category: params.category || '' } });
    return { items: response.data.data as Post[], meta: response.data.meta };
  } catch (error) { return rejectWithValue(getErrorMessage(error)); }
});

const postsSlice = createSlice({
  name: 'posts', initialState,
  reducers: { setQuery(state, action: { payload: string }) { state.query = action.payload; }, setCategory(state, action: { payload: string }) { state.category = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.items; state.page = action.payload.meta.page; state.totalPages = action.payload.meta.totalPages; state.total = action.payload.meta.total; });
    builder.addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Unable to load articles.'); });
  }
});
export const { setQuery, setCategory } = postsSlice.actions;
export default postsSlice.reducer;
