
import { apiSlice } from "../../api/apiSlice";

interface GetSessions{

  page?:number;
  page_size?:number;
  course_name?:string;
  status?:string;
  cohort?:string;
 
}
export const courseSessionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseSessions: builder.query({
      query: ({
       
        page,
        page_size,
        cohort,
        status,
        course_name
      }: GetSessions = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

       
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (course_name) queryParams.course_name = course_name;
        if (status) queryParams.status = status;
        if (cohort) queryParams.cohort = cohort;
        return {
          url: `schools/course-session/list/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createCourseSession: builder.mutation({
      query: (data) => ({
        url: `schools/course-session/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateCourseSession: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/course-session/update-delete/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),

    deleteCourseSession: builder.mutation({
      query: (id) => ({
        url: `schools/course-session/update-delete/${id}/`,
        method: "DELETE",
      }),
    }),
   
   
  }),
});

export const {
useGetCourseSessionsQuery,
useCreateCourseSessionMutation,
useUpdateCourseSessionMutation,
useDeleteCourseSessionMutation,


} = courseSessionApi;
