import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();
const hasStoredToken =
  typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: initialUser,
    isAuthenticated: Boolean(initialUser && hasStoredToken),
    isLoading: hasStoredToken, // Only start loading if there's a stored session to verify
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUserData, setLoading, setError, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
