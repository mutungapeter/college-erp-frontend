import { apiSlice } from "@/store/api/apiSlice";
import {
  userLoading,
  userLoggedIn,
  userLoggedOut,
  userRegistration,
} from "./authSlice";
import Cookies from "js-cookie";
import { User } from "@/store/definitions";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: `users/login/`,
        method: "POST",
        body: {
          username,
          password,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          const result = await queryFulfilled;
          // console.log("result", result);

          Cookies.set("accessToken", result.data.access);
          Cookies.set("refreshToken", result.data.refresh);

          // Fetch permissions immediately after successful login
          try {
            const permissions = await dispatch(
              authApi.endpoints.getPermissions.initiate()
            ).unwrap();

            
            dispatch(
              userLoggedIn({
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                user: {
                  ...result.data.user,
                  role: {
                    ...result.data.user.role,
                    permissions: permissions.role?.permissions || [],
                  },
                },
              })
            );
          } catch (permissionError) {
            console.error("Failed to fetch permissions:", permissionError);
            // Still login the user but without permissions
            dispatch(
              userLoggedIn({
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                user: result.data.user,
              })
            );
          }
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
    createAccount: builder.mutation({
      query: (data) => ({
        url: `users/register/`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("===result", result);
          dispatch(userRegistration());
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unknown error occurred.");
          }
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => {
        const refreshToken = Cookies.get("refreshToken");
        // console.log("refreshToken", refreshToken)
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        return {
          url: `users/logout/`,
          method: "POST",
          body: { refresh: refreshToken },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          await queryFulfilled;

          // Clear cookies
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          // Update state
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unknown error occurred.");
          }
        }
      },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: `users/me/`,
        method: "GET",
      }),
    }),
    getPermissions: builder.query<User, void>({
      query: () => ({
        url: `core/permissions/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateAccountMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
} = authApi;
