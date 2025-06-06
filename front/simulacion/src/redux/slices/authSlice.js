import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3001/user/login', credentials);
            // Guardamos el token en localStorage
            localStorage.setItem('token', JSON.stringify(response.data.token));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error en el login');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            // Removemos el token al hacer logout
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Removemos el token si hay error
                localStorage.removeItem('token');
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 