import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/store/definitions";


interface AuthState {
  accessToken: string;
  refreshToken: string;
  user:  User | null;
  tokenExpiry: number | null;
  loading: boolean; 
  error: string | null;

}
export interface DecodedToken {
  token_type: "access" | "refresh";
  exp: number; 
  iat: number; 
  jti: string; 
  user_id: number;
  user: User;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  user:  null,
  tokenExpiry: null,
  loading: false, 
  error: null,

};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{

      userLoading: (state) => {
        state.loading = true;
        state.error = null;  
      },
      userRegistration: (state) => {
        state.loading = false;
      },
      
      userLoggedIn: (
        state,
        action: PayloadAction<{
          accessToken: string;
          refreshToken: string;
          user: null;
        }>
      ) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        // console.log("state.user",state.user )
        const decodedToken: DecodedToken = jwtDecode(action.payload.accessToken);
        console.log("decodedToken", decodedToken)
        state.tokenExpiry = decodedToken.exp * 1000; 
  
        state.loading = false; 
      },
  
      userLoggedOut: (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.user = null;
        state.tokenExpiry = null;
        state.loading = false;
        Cookies.remove("accessToken");
       Cookies.remove("refreshToken");
      },
  
      userLoginFailed: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;  
      },
      loadUser: (state) => {
        // console.log("Loading user...");
        state.loading = true;
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
  
        if (accessToken && refreshToken) {
          const decodedToken: DecodedToken = jwtDecode(accessToken);
          // console.log("decodedTOken", decodedToken)
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.user = decodedToken.user;  
          state.tokenExpiry = decodedToken.exp * 1000;
          state.loading = false;
        } else {
          state.accessToken = "";
          state.refreshToken = "";
          state.user = null;
          state.tokenExpiry = null;
        }
        state.loading = false;
      },
    }
})

export const  {userLoggedIn,userLoggedOut,userLoginFailed, loadUser, userLoading, userRegistration} = authSlice.actions;
export default authSlice.reducer;