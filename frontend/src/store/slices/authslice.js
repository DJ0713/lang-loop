import { createSlice } from "@reduxjs/toolkit";

const token =
  localStorage.getItem("langloop_token") ||
  localStorage.getItem("token");

const storedUser = localStorage.getItem("user");

let user = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  user = null;
}

const initialState = {
  user,
  token,
  isAuthenticated: Boolean(token),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      if (token) {
        localStorage.setItem("langloop_token", token);
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("langloop_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(state.user)
      );
    },

    restoreAuth: (state) => {
      const savedToken =
        localStorage.getItem("langloop_token") ||
        localStorage.getItem("token");

      const savedUser = localStorage.getItem("user");

      state.token = savedToken;
      state.isAuthenticated = Boolean(savedToken);

      if (savedUser) {
        try {
          state.user = JSON.parse(savedUser);
        } catch (error) {
          state.user = null;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase("auth/login/fulfilled", (state, action) => {
      const payload = action.payload || {};

      state.user = {
        username: payload.username,
        role: payload.role,
        ...payload,
      };

      state.isAuthenticated = true;
    });
  },
});

export const {
  login,
  logout,
  updateUser,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;