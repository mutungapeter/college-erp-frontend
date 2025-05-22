
import { apiSlice } from "../../api/apiSlice";

interface GetDepartments {

  page?:number;
  page_size?:number;
  department_name?:string;
  school?:string;
  status?:string;
 
}
export const departmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: ({
       
        page,
        page_size,
        department_name,
        school,
        status
      }: GetDepartments = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

       
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (department_name) queryParams.department_name = department_name;
        if (school) queryParams.school = school;
        if (status) queryParams.status = status;
        return {
          url: `schools/department/list/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createDepartment: builder.mutation({
      query: (data) => ({
        url: `schools/department/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateDepartment: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/department/update-delete/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),

    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `schools/department/update-delete/${id}/`,
        method: "DELETE",
      }),
    }),
   
   
  }),
});

export const {
useCreateDepartmentMutation,
useGetDepartmentsQuery,
useUpdateDepartmentMutation,
useDeleteDepartmentMutation,

} = departmentsApi;
