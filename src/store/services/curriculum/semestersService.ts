import { apiSlice } from '../../api/apiSlice';

interface GetCohorts {
  page?: number;
  page_size?: number;
  status?: string;
  semester_name?: string;
}
export const semestersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query({
      query: ({ page, page_size, status, semester_name }: GetCohorts = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (status) queryParams.status = status;
        if (semester_name) queryParams.semester_name = semester_name;
        return {
          url: `schools/semester/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createSemester: builder.mutation({
      query: (data) => ({
        url: `schools/semester/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateSemester: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/semester/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteSemester: builder.mutation({
      query: (id) => ({
        url: `schools/semester/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSemestersQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = semestersApi;
