import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../../api/axios"

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const res = await API.post('auth/login', credentials);
        const { refreshToken, accessToken, user } = res.data.data;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        return user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login Failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const res = await API.post('auth/register', userData);
         const { accessToken, refreshToken, user } = res.data.data;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        return user;    
    } catch (err) {
       return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await API.post('auth/logout');
    localStorage.clear();
})


export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const res = await API.get('auth/me');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user : null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        //login
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //register
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //logout
        .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })
        // getMe
        .addCase(getMe.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(getMe.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;