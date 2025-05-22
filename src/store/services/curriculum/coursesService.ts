
import { apiSlice } from "../../api/apiSlice";

interface GetCourses{

  page?:number;
  page_size?:number;
  course_name?:string;
  department?:string;
 
}
export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: ({
       
        page,
        page_size,
        department,
        course_name
      }: GetCourses = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

       
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (course_name) queryParams.course_name = course_name;
        if (department) queryParams.department = department;
        return {
          url: `schools/course/list/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createCourse: builder.mutation({
      query: (data) => ({
        url: `schools/course/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/course/update-delete/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `schools/course/update-delete/${id}/`,
        method: "DELETE",
      }),
    }),
   
   
  }),
});

export const {
useCreateCourseMutation,
useGetCoursesQuery,
useUpdateCourseMutation,
useDeleteCourseMutation,

} = coursesApi;
