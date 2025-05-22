
import { apiSlice } from "../../api/apiSlice";

interface GetApplicationsTypes{

  page?:number;
  page_size?:number;
  application_no?:string;
  phone_no?:string;
  intake?:string;
  status?:string;
}
export const admissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  getApplicationsList: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no
      }: GetApplicationsTypes = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        console.log("queryParams====",queryParams)
  
        return {
          url: `admissions/applications/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
   
    makeApplication: builder.mutation({
      query: (data) => ({
        url: `admissions/applications/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    createEducationHistory: builder.mutation({
      query: (data) => ({
        url: `admissions/education-history/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateEducationHistory: builder.mutation({
      query: ({id, data}) => ({
        url: `admissions/education-history/${id}/update/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
    deleteEducationHistory: builder.mutation({
      query: (id) => ({
        url: `admissions/education-history/${id}/update/`,
        method: "DELETE",        
      }),
    }),
    getIntakes: builder.query({
      query: () => ({
        url: `admissions/intakes/`,
        method: "GET",
        
      }),
    }),
    enrollApplication: builder.mutation({
      query: (data) => ({
        url: `admissions/applications/enroll-student/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/applications/${id}/update/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
    updateApplicationDocument: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/documents/${id}/update/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
   
    createApplicationDocument: builder.mutation({
      query: (data) => ({
        url: `admissions/documents/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `admissions/documents/${id}/`,
        method: "DELETE",
     
        
      }),
    }),
   

   
    getApplication: builder.query({
      query: (id) => ({
        url: `admissions/applications/details/${id}/`,
        method: "GET",
      }),
    }),
    
   
   
  }),
});

export const {
useGetApplicationQuery,
useMakeApplicationMutation,
useGetApplicationsListQuery,
useUpdateApplicationMutation,
useGetIntakesQuery,
useUpdateEducationHistoryMutation,
useCreateEducationHistoryMutation,
useCreateApplicationDocumentMutation,
useUpdateApplicationDocumentMutation,
useEnrollApplicationMutation,
useDeleteDocumentMutation,

useDeleteEducationHistoryMutation
} = admissionsApi;
