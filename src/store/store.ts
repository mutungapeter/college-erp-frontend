"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice, { loadUser, userLoggedIn } from "./services/auth/authSlice";
import Cookies from "js-cookie";
import { authApi } from "./services/auth/authService";


export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  // Step 1: Load tokens into state
  store.dispatch(loadUser());

  // Step 2: If we have an access token, fetch the current user from /users/me/
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  if (accessToken) {
    store
      .dispatch(authApi.endpoints.getCurrentUser.initiate())
      .unwrap()
      .then((user) => {
        store.dispatch(
          userLoggedIn({
            accessToken,
            refreshToken: Cookies.get("refreshToken") || "",
            user,
          })
        );
      })
      .catch((err) => {
        console.error("Failed to fetch current user:", err);
      });
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
