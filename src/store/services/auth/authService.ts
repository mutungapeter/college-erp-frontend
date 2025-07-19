import { apiSlice } from "@/store/api/apiSlice";
import { userLoading, userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import Cookies from "js-cookie";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `users/login/`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          const result = await queryFulfilled;
      
          Cookies.set("accessToken", result.data.access);
          Cookies.set("refreshToken", result.data.refresh);
            dispatch(
              userLoggedIn({
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                user: result.data.user,
              })
            );
           
        }  catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);  
          } else {
            console.log("An unknown error occurred.");
          }
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
          dispatch(
            userRegistration()
          );
        }  catch (error: unknown) {
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
          body: { refresh: refreshToken }
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
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);  
          } else {
            console.log("An unknown error occurred.");
          }
        }
      },
    }),
  }),
});


export const { useLoginMutation, 
  useCreateAccountMutation, 
  useLogoutUserMutation
} = authApi;

