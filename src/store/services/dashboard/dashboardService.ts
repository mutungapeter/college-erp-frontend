import { apiSlice } from "../../api/apiSlice";


export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCounts: builder.query({
      query: () => {
       

        return {
          url: `core/dashboard-counts/`,
          method: "GET",
        };
      },
    }),
  
   
  }),
});

export const {
 useGetDashboardCountsQuery,
} = dashboardApi;
