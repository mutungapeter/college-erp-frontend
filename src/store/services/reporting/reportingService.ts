
import { apiSlice } from "../../api/apiSlice";


interface ReportingInterface{
  page?:number;
  page_size?:number;
  department?:string;
  cohort?:string;
  search?:string;
}
export const reportingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  getReportingList: builder.query({
      query: ({
        page,
        page_size,
        cohort,
        search,
        department,

      }: ReportingInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (cohort) queryParams.cohort = cohort;
        if (department) queryParams.department = department;
        
      
  
        return {
          url: `students/reporting-list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
   
    semesterReporting: builder.mutation({
      query: ({data, cohort_id}) => ({
        url: `students/semester-reporting/${cohort_id}/`,
        method: "POST",
        body: data,
        
      }),
    }),
    singelStudentSemesterReporting: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/`,
        method: "POST",
        body: data,
        
      }),
    }),
    

  }),
});

export const {
useGetReportingListQuery,
useSemesterReportingMutation,
useSingelStudentSemesterReportingMutation
} = reportingApi;
