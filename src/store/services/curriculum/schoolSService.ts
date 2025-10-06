import { apiSlice } from '../../api/apiSlice';

interface GetSchoolsType {
  page?: number;
  page_size?: number;
  school_name?: string;
  status?: string;
}
export const schoolsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query({
      query: ({
        page,
        page_size,
        school_name,
        status,
      }: GetSchoolsType = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (school_name) queryParams.school_name = school_name;
        if (status) queryParams.status = status;
        return {
          url: `schools/school/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createSchool: builder.mutation({
      query: (data) => ({
        url: `schools/school/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateSchool: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/school/update-delete/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `schools/school/update-delete/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = schoolsApi;
