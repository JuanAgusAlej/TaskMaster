import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

// --- Thunks Asíncronos ---

export const loadSession = createAsyncThunk<string | null>(
  'auth/loadSession',
  async () => {
    return await authService.getCurrentUser();
  }
);

export const loginAsync = createAsyncThunk<string, { username: string; password: string }>(
  'auth/loginAsync',
  async ({ username, password }, { rejectWithValue }) => {
    const success = await authService.loginUser(username, password);
    if (!success) {
      return rejectWithValue('Credenciales inválidas');
    }
    return username;
  }
);

export const logoutAsync = createAsyncThunk<void>(
  'auth/logoutAsync',
  async () => {
    await authService.logout();
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // loadSession
    builder.addCase(loadSession.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadSession.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    });
    builder.addCase(loadSession.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    });

    // loginAsync
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    // logoutAsync
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export default authSlice.reducer;
