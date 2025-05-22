
import { apiSlice } from "../../api/apiSlice";

interface GetCohorts{

  page?:number;
  page_size?:number;
  name?:string;
  status?:string;
 
}
export const cohortsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCohorts: builder.query({
      query: ({
       
        page,
        page_size,
        name,
        status
      }: GetCohorts = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

       
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (name) queryParams.name = name;
        if (status) queryParams.status = status;
        return {
          url: `schools/programme-cohort/list/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createCohort: builder.mutation({
      query: (data) => ({
        url: `schools/programme-cohort/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateCohort: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/programme-cohort/update-delete/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),

    deleteCohort: builder.mutation({
      query: (id) => ({
        url: `schools/programme-cohort/update-delete/${id}/`,
        method: "DELETE",
      }),
    }),
   
   
  }),
});

export const {
useCreateCohortMutation,
useGetCohortsQuery,
useUpdateCohortMutation,
useDeleteCohortMutation

} = cohortsApi;
