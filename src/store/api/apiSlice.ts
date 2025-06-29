import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    prepareHeaders: async (headers,  { endpoint }) => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
     const endpointsUsingFormData = [
        'uploadStudents', 
        'updateApplicationDocument',
        'createApplicationDocument',
        'uploadMarks',
        'uploadStaffDocument',
      ];
       if (endpointsUsingFormData.includes(endpoint)) {
        headers.delete('Content-Type'); 
      }
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (refreshToken) {
        headers.set("refreshToken", refreshToken);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const {} = apiSlice;
